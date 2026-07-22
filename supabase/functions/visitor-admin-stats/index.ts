const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

type Visit = {
  visitor_id?: string;
  visited_at?: string;
  local_time?: string;
  page_path?: string;
  country?: string;
  region?: string;
  city?: string;
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
  const uniqueVisitors = new Set<string>();
  const recentVisits: Visit[] = [];
  let totalVisits = 0;
  let offset = 0;
  const pageSize = 1000;

  while (true) {
    const query = new URLSearchParams({
      select: 'visitor_id,visited_at,local_time,page_path,country,region,city',
      order: 'visited_at.desc',
      limit: String(pageSize),
      offset: String(offset)
    });

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
    totalVisits += visits.length;
    visits.forEach((visit: Visit) => {
      if (visit.visitor_id) uniqueVisitors.add(visit.visitor_id);
    });
    recentVisits.push(...visits.slice(0, Math.max(0, 50 - recentVisits.length)));

    if (visits.length < pageSize) break;
    offset += pageSize;
  }

  return jsonResponse({
    totalVisits,
    uniqueVisitors: uniqueVisitors.size,
    visits: recentVisits
  });
});
