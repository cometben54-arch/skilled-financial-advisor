// Cloudflare Pages Function — AI chat proxy
// Reads admin-configured model from KV, calls the real LLM API with skill prompt

interface Env {
  CONFIG_KV: KVNamespace;
}

interface ChatRequest {
  systemPrompt: string;
  userMessage: string;
  mode: 'quick' | 'expert';
  customEndpoint?: string;
  customApiKey?: string;
  customModel?: string;
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

const RETRYABLE_STATUS = [429, 529, 502, 503];
const MAX_RETRIES = 4;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, init);

    if (res.ok || !RETRYABLE_STATUS.includes(res.status)) {
      return res;
    }

    // Last attempt — return the error response
    if (attempt === MAX_RETRIES) {
      return res;
    }

    // Exponential backoff: 2s, 4s, 8s, 16s
    const delay = Math.pow(2, attempt + 1) * 1000;
    await sleep(delay);
  }

  // Should never reach here, but satisfy TS
  return fetch(url, init);
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }

  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: cors });
  }

  try {
    const body = (await context.request.json()) as ChatRequest;

    // Determine which API to call
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
        return new Response(JSON.stringify({ error: 'No AI model configured. Ask the admin to set up a model.' }), {
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

    const maxTokens = body.mode === 'quick' ? 2000 : 8000;
    const isAnthropic = provider.includes('anthropic') || endpoint.includes('anthropic');

    if (isAnthropic) {
      const apiUrl = endpoint.replace(/\/+$/, '') + '/messages';
      const llmResponse = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelId,
          max_tokens: maxTokens,
          system: body.systemPrompt,
          messages: [{ role: 'user', content: body.userMessage }],
        }),
      });

      if (!llmResponse.ok) {
        const err = await llmResponse.text();
        const statusHint = llmResponse.status === 529 ? ' (API overloaded — retries exhausted)'
          : llmResponse.status === 429 ? ' (rate limited — retries exhausted)'
          : '';
        return new Response(JSON.stringify({
          error: `LLM API error: ${llmResponse.status}${statusHint}`,
          detail: err,
        }), {
          status: 502, headers: { 'Content-Type': 'application/json', ...cors },
        });
      }

      const data = await llmResponse.json() as { content: { type: string; text: string }[] };
      const rawText = data.content?.map((c) => c.text).join('') || '';
      const text = rawText.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();

      return new Response(JSON.stringify({ content: text }), {
        headers: { 'Content-Type': 'application/json', ...cors },
      });

    } else {
      // Smart URL: don't append /chat/completions if endpoint already has a path
      const cleanEndpoint = endpoint.replace(/\/+$/, '');
      const apiUrl = /\/(chat\/completions|completions|chatcompletion)/i.test(cleanEndpoint)
        ? cleanEndpoint
        : cleanEndpoint + '/chat/completions';
      const llmResponse = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          max_tokens: maxTokens,
          messages: [
            { role: 'system', content: body.systemPrompt },
            { role: 'user', content: body.userMessage },
          ],
        }),
      });

      if (!llmResponse.ok) {
        const err = await llmResponse.text();
        const statusHint = llmResponse.status === 429 ? ' (rate limited — retries exhausted)'
          : llmResponse.status === 529 ? ' (API overloaded — retries exhausted)'
          : '';
        return new Response(JSON.stringify({
          error: `LLM API error: ${llmResponse.status}${statusHint}`,
          detail: err,
        }), {
          status: 502, headers: { 'Content-Type': 'application/json', ...cors },
        });
      }

      const data = await llmResponse.json() as { choices: { message: { content: string } }[] };
      const rawText = data.choices?.[0]?.message?.content || '';
      const text = rawText.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();

      return new Response(JSON.stringify({ content: text }), {
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal error', detail: String(e) }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...cors },
    });
  }
};
