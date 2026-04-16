// Cloudflare Pages Function — shared admin config API
// KV binding: CONFIG_KV (set in Cloudflare Dashboard > Pages > Settings > Functions > KV bindings)

interface Env {
  CONFIG_KV: KVNamespace;
}

const ADMIN_PASSWORD = 'W@ng2BO';
const CONFIG_KEY = 'admin-config';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// GET — all users can read shared config
// POST — admin saves config (password required)
export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }

  if (context.request.method === 'GET') {
    try {
      const data = await context.env.CONFIG_KV.get(CONFIG_KEY);
      return new Response(data || '{"models":[],"skills":null,"visionModel":null}', {
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    } catch {
      return new Response('{"models":[],"skills":null,"visionModel":null}', {
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
  }

  if (context.request.method === 'POST') {
    try {
      const body = await context.request.json() as {
        password: string;
        models?: unknown;
        skills?: unknown;
        visionModel?: unknown;
      };

      if (body.password !== ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...cors },
        });
      }

      // Read existing, merge
      const existing = await context.env.CONFIG_KV.get(CONFIG_KEY);
      const current = existing ? JSON.parse(existing) : { models: [], skills: null, visionModel: null };

      if (body.models !== undefined) current.models = body.models;
      if (body.skills !== undefined) current.skills = body.skills;
      if (body.visionModel !== undefined) current.visionModel = body.visionModel;

      await context.env.CONFIG_KV.put(CONFIG_KEY, JSON.stringify(current));

      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
  }

  return new Response('Method not allowed', { status: 405, headers: cors });
};
