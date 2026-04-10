// Cloudflare Pages Function — AI chat proxy
// Reads admin-configured model from KV, calls the real LLM API with skill prompt

interface Env {
  CONFIG_KV: KVNamespace;
}

interface ChatRequest {
  systemPrompt: string;
  userMessage: string;
  mode: 'quick' | 'expert';
  // Optional: user's own key override
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
    let provider = 'openai'; // default to OpenAI-compatible

    if (body.customEndpoint && body.customApiKey && body.customModel) {
      // User's own key
      endpoint = body.customEndpoint;
      apiKey = body.customApiKey;
      modelId = body.customModel;
    } else {
      // Use admin-configured default model from KV
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

    // Build the request based on provider
    const maxTokens = body.mode === 'quick' ? 2000 : 8000;

    // Detect provider type from endpoint/provider name
    const isAnthropic = provider.includes('anthropic') || endpoint.includes('anthropic');

    let llmResponse: Response;

    if (isAnthropic) {
      // Anthropic Claude API
      const apiUrl = endpoint.replace(/\/+$/, '') + '/messages';
      llmResponse = await fetch(apiUrl, {
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
        return new Response(JSON.stringify({ error: `LLM API error: ${llmResponse.status}`, detail: err }), {
          status: 502, headers: { 'Content-Type': 'application/json', ...cors },
        });
      }

      const data = await llmResponse.json() as { content: { type: string; text: string }[] };
      const text = data.content?.map((c) => c.text).join('') || '';

      return new Response(JSON.stringify({ content: text }), {
        headers: { 'Content-Type': 'application/json', ...cors },
      });

    } else {
      // OpenAI-compatible API (OpenAI, DeepSeek, etc.)
      const apiUrl = endpoint.replace(/\/+$/, '') + '/chat/completions';
      llmResponse = await fetch(apiUrl, {
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
        return new Response(JSON.stringify({ error: `LLM API error: ${llmResponse.status}`, detail: err }), {
          status: 502, headers: { 'Content-Type': 'application/json', ...cors },
        });
      }

      const data = await llmResponse.json() as { choices: { message: { content: string } }[] };
      const text = data.choices?.[0]?.message?.content || '';

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
