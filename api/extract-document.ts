import { handleExtractDocument } from '../src/server/handlers';

function sendJson(res: any, status: number, obj: any) {
  res.statusCode = status;
  if (typeof res.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }
  await handleExtractDocument(req, res);
}
