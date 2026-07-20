const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const allowedFields = [
  'visitor_id',
  'visited_at',
  'local_time',
  'page_path',
  'page_hash',
  'referrer',
  'user_agent',
  'language',
  'timezone',
  'ip',
  'country',
  'region',
  'city',
  'latitude',
  'longitude'
];

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Supabase environment is not configured' }, 500);
  }

  const input = await request.json().catch(() => ({}));
  const payload = Object.fromEntries(
    allowedFields
      .filter((field) => Object.hasOwn(input, field))
      .map((field) => [field, input[field]])
  );

  if (!payload.visitor_id) {
    return jsonResponse({ error: 'visitor_id is required' }, 400);
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/visitor_logs`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return jsonResponse({ error: 'Failed to record visit' }, 500);
  }

  return jsonResponse({ ok: true });
});
