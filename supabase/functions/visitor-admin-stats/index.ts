const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}

function isIsoDate(value: unknown) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
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
  const adminPassword = Deno.env.get('ADMIN_PASSWORD');
  if (!supabaseUrl || !serviceRoleKey || !adminPassword) {
    return jsonResponse({ error: 'Admin stats environment is not configured' }, 500);
  }

  const input = await request.json().catch(() => ({}));
  if (input.password !== adminPassword) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  if (!isIsoDate(input.start) || !isIsoDate(input.end)) {
    return jsonResponse({ error: 'Valid start and end are required' }, 400);
  }

  const query = new URLSearchParams({
    select: 'visitor_id,visited_at,local_time,page_path,country,region,city',
    visited_at: `gte.${input.start}`,
    order: 'visited_at.desc',
    limit: '1000'
  });
  query.append('visited_at', `lt.${input.end}`);

  const response = await fetch(`${supabaseUrl}/rest/v1/visitor_logs?${query}`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`
    }
  });

  if (!response.ok) {
    return jsonResponse({ error: 'Failed to load visitor stats' }, 500);
  }

  const visits = await response.json();
  const uniqueVisitors = new Set(
    visits.map((visit: { visitor_id?: string }) => visit.visitor_id).filter(Boolean)
  );

  return jsonResponse({
    totalVisits: visits.length,
    uniqueVisitors: uniqueVisitors.size,
    visits: visits.slice(0, 50)
  });
});
