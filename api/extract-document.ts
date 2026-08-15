import { handleExtractDocument } from '../src/server/handlers';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  await handleExtractDocument(req, res);
}
