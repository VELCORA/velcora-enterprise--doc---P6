function sendJson(res: any, status: number, obj: any) {
  res.statusCode = status;
  if (typeof res.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

export function handleHealth(_req: any, res: any) {
  sendJson(res, 200, {
    status: 'healthy',
    service: 'Velcora Enterprise Document Processing & Workflow Automation System',
    timestamp: new Date().toISOString(),
    version: '4.2.0-enterprise',
    engine: process.env.GEMINI_API_KEY ? 'gemini-2.5-flash' : 'deterministic-fallback',
  });
}

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }
  try {
    handleHealth(req, res);
  } catch (e: any) {
    sendJson(res, 500, { error: String(e && e.stack ? e.stack : e) });
  }
}
