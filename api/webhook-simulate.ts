import { handleWebhookSimulate } from '../src/server/handlers';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  handleWebhookSimulate(req, res);
}
