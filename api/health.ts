import { handleHealth } from '../src/server/handlers';

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  handleHealth(req, res);
}
