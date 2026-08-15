function sendJson(res: any, status: number, obj: any) {
  res.statusCode = status;
  if (typeof res.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

export function handleWebhookSimulate(req: any, res: any) {
  const { targetSystem, documentId, payload, ruleName } = req.body || {};

  const mockResponse = {
    success: true,
    executionId: `EXEC-VEL-${Date.now()}`,
    targetSystem: targetSystem || 'External Webhook / ERP Endpoint',
    ruleExecuted: ruleName || 'Auto-Sync Structured Data',
    documentId: documentId || 'DOC-CURRENT',
    timestamp: new Date().toISOString(),
    responseCode: 200,
    status: 'DELIVERED',
    message: `Payload successfully delivered to ${targetSystem || 'webhook endpoint'}.`,
    payloadSummary: {
      invoiceNumber: payload?.financials?.invoiceNumber || 'N/A',
      vendor: payload?.vendorInfo?.name || 'N/A',
      totalAmount: payload?.financials?.totalAmount || 0,
      itemCount: payload?.lineItems?.length || 0,
    },
  };

  return sendJson(res, 200, mockResponse);
}

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }
  try {
    handleWebhookSimulate(req, res);
  } catch (e: any) {
    sendJson(res, 500, { error: String(e && e.stack ? e.stack : e) });
  }
}
