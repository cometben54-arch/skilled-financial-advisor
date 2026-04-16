// Cloudflare Pages Function — Vision API for portfolio screenshot OCR
// Uses LLM vision capability to extract holdings from uploaded images

interface Env {
  CONFIG_KV: KVNamespace;
}

interface AdminModel {
  id: string;
  name: string;
  provider: string;
  apiEndpoint: string;
  apiKey: string;
  modelId: string;
  isDefault: boolean;
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const RETRYABLE_STATUS = [429, 502, 503, 529];
const MAX_RETRIES = 4;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, init);
    if (res.ok || !RETRYABLE_STATUS.includes(res.status)) return res;
    if (attempt === MAX_RETRIES) return res;
    // Backoff: 2s, 4s, 8s, 16s
    await sleep(Math.pow(2, attempt + 1) * 1000);
  }
  return fetch(url, init);
}

const EXTRACT_PROMPT = `You are a portfolio data extraction tool. Look at this screenshot of a brokerage/trading account and extract every visible holding.

Output ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "holdings": [
    {"ticker": "AAPL", "name": "Apple Inc.", "weight": 25, "costBasis": 145.00, "currentPrice": 198.36, "sector": "Technology"}
  ],
  "rawText": "<any other text visible in the image that might be relevant>"
}

Rules:
- ticker: uppercase stock symbol
- name: full company name
- weight: portfolio percentage (if not shown, estimate from dollar amounts)
- costBasis: average cost per share (null if not visible)
- currentPrice: current/last price (null if not visible)
- sector: best guess sector
- If you cannot identify specific holdings, set holdings to [] and put description in rawText
- Extract ALL visible holdings, not just the first few`;

/**
 * Determine the correct chat completions URL.
 * If the endpoint already looks like a full URL with path, use it as-is.
 * Otherwise append /chat/completions.
 */
function getChatUrl(endpoint: string): string {
  const clean = endpoint.replace(/\/+$/, '');
  // If it already ends with a completions-like path, use as-is
  if (/\/(chat\/completions|completions|messages|chatcompletion)/i.test(clean)) {
    return clean;
  }
  return clean + '/chat/completions';
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }

  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: cors });
  }

  try {
    const body = (await context.request.json()) as {
      image: string;
      locale?: string;
      customEndpoint?: string;
      customApiKey?: string;
      customModel?: string;
    };

    if (!body.image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    // Determine API credentials
    let endpoint: string;
    let apiKey: string;
    let modelId: string;
    let provider = 'openai';

    if (body.customEndpoint && body.customApiKey && body.customModel) {
      endpoint = body.customEndpoint;
      apiKey = body.customApiKey;
      modelId = body.customModel;
    } else {
      const configRaw = await context.env.CONFIG_KV.get('admin-config');
      if (!configRaw) {
        return new Response(JSON.stringify({ error: 'No AI model configured.' }), {
          status: 503, headers: { 'Content-Type': 'application/json', ...cors },
        });
      }
      const config = JSON.parse(configRaw);
      const models: AdminModel[] = config.models || [];
      const activeModel = models.find((m) => m.isDefault) || models.find((m) => m.apiKey);
      if (!activeModel || !activeModel.apiKey) {
        return new Response(JSON.stringify({ error: 'No AI model with API key configured.' }), {
          status: 503, headers: { 'Content-Type': 'application/json', ...cors },
        });
      }
      endpoint = activeModel.apiEndpoint;
      apiKey = activeModel.apiKey;
      modelId = activeModel.modelId;
      provider = activeModel.provider?.toLowerCase() || 'openai';
    }

    const langNote = body.locale === 'zh'
      ? '\nOutput field values in Chinese where appropriate (sector names, rawText).'
      : '';

    const isAnthropic = provider.includes('anthropic') || endpoint.includes('anthropic');

    // Extract media type and base64 data
    const mediaTypeMatch = body.image.match(/^data:(image\/[^;]+);base64,/);
    const mediaType = mediaTypeMatch ? mediaTypeMatch[1] : 'image/jpeg';
    const base64Data = body.image.replace(/^data:image\/[^;]+;base64,/, '');

    let llmResponse: Response;

    if (isAnthropic) {
      // ── Anthropic Claude Vision ──
      const apiUrl = endpoint.replace(/\/+$/, '') + '/messages';
      llmResponse = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelId,
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
              { type: 'text', text: EXTRACT_PROMPT + langNote },
            ],
          }],
        }),
      });

      if (!llmResponse.ok) {
        const errText = await llmResponse.text();
        return new Response(JSON.stringify({
          error: `Vision API error: ${llmResponse.status}`,
          detail: errText,
        }), {
          status: 502, headers: { 'Content-Type': 'application/json', ...cors },
        });
      }

      const data = await llmResponse.json() as { content: { type: string; text: string }[] };
      const rawText = data.content?.map((c) => c.text).join('') || '';
      const cleanedText = rawText.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
      return new Response(JSON.stringify({ content: cleanedText }), {
        headers: { 'Content-Type': 'application/json', ...cors },
      });

    } else {
      // ── OpenAI-compatible Vision (OpenAI, MiniMax, DeepSeek, etc.) ──
      const apiUrl = getChatUrl(endpoint);
      const imageDataUrl = `data:${mediaType};base64,${base64Data}`;

      // Try multiple vision formats — different providers expect different structures
      const formats = [
        // Format 1: text first, image second (some providers are order-sensitive)
        {
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: EXTRACT_PROMPT + langNote },
              { type: 'image_url', image_url: { url: imageDataUrl, detail: 'high' } },
            ],
          }],
        },
        // Format 2: image first (standard OpenAI order)
        {
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageDataUrl } },
              { type: 'text', text: EXTRACT_PROMPT + langNote },
            ],
          }],
        },
        // Format 3: single message with image_url at top level (some CN providers)
        {
          messages: [
            { role: 'user', content: EXTRACT_PROMPT + langNote },
            { role: 'user', content: [{ type: 'image_url', image_url: { url: imageDataUrl } }] },
          ],
        },
      ];

      let lastError = '';
      let lastStatus = 0;

      for (const format of formats) {
        const requestBody = {
          model: modelId,
          max_tokens: 4000,
          ...format,
        };

        llmResponse = await fetchWithRetry(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (llmResponse.ok) {
          const data = await llmResponse.json() as { choices?: { message: { content: string } }[] };
          const text = data.choices?.[0]?.message?.content || '';

          // Check if the model actually saw the image (not "no image" response)
          const noImageIndicators = [
            '未提供', '无法提取', 'no image', 'no screenshot', 'cannot see',
            '没有提供', '未收到', '无法识别', 'not provided', 'no picture',
          ];
          const lowerText = text.toLowerCase();
          const modelSawImage = !noImageIndicators.some((ind) => lowerText.includes(ind));

          if (modelSawImage) {
            // Strip <think>...</think> blocks from response
            const cleanedText = text.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
            return new Response(JSON.stringify({ content: cleanedText }), {
              headers: { 'Content-Type': 'application/json', ...cors },
            });
          }
          // Model didn't see the image — try next format
          continue;
        }

        lastError = await llmResponse.text();
        lastStatus = llmResponse.status;

        // If it's a 4xx error (not retryable), try next format
        if (llmResponse.status >= 400 && llmResponse.status < 500 && llmResponse.status !== 429) {
          continue;
        }
      }

      // All formats failed
      return new Response(JSON.stringify({
        error: lastStatus === 529
          ? 'AI 服务暂时过载，请稍后重试（已自动重试 4 次）'
          : `Vision API: all image formats failed (last status: ${lastStatus})`,
        detail: lastError,
      }), {
        status: 502, headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal error', detail: String(e) }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...cors },
    });
  }
};
