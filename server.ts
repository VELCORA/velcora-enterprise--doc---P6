import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { handleHealth, handleExtractDocument, handleWebhookSimulate } from './api/_lib/handlers';

const app = express();
const PORT = 3000;

// Body parser middleware with large limit for scanned documents & image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/health', handleHealth);
app.post('/api/extract-document', handleExtractDocument);
app.post('/api/webhook/simulate', handleWebhookSimulate);

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Velcora Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
