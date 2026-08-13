<div align="center">
  <img src="public/favicon.svg" alt="Velcora" width="120" height="120" />
</div>

<h1 align="center">Velcora — Enterprise Document Processing & Automation Workbench</h1>

<div align="center">
  AI-powered document intelligence: extract, audit, and automate enterprise financial paperwork in seconds.
</div>

---

## What it does

Velcora turns messy enterprise financial documents (invoices, purchase orders, bank statements, tax forms) into clean, structured, validated data — then routes it to your ERP or any webhook.

- **AI Extraction** — Gemini 2.5-flash reads the document and pulls line items, totals, tax, and vendor fields.
- **Risk & Anomaly Audit** — flags duplicate line items, tax mismatches, and missing fields before they hit your books.
- **Structured Viewer** — human-readable, print-ready canvas of the extracted data with a Velcora watermark.
- **Live Processing Pipeline** — real-time stage view (scan → parse → structure → audit → enrich → done).
- **Sample Library** — one-click load realistic sample documents to test the pipeline.
- **ERP / Webhook Automation** — push validated extracts to any endpoint (labeled honestly as an automation hook, not a fake "guaranteed ERP connect").

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **AI:** Google Gemini 2.5-flash (via `GEMINI_API_KEY`)
- **Backend:** Node/Express (`server.ts`) for the analysis + webhook proxy
- **Build:** Vite (client) + esbuild (server → `dist/server.cjs`)

## Quick Start

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Add your Gemini API key
#    Create .env.local with:
GEMINI_API_KEY=your_key_here

# 3. Run locally
npm run dev
```

## Build & Deploy

```bash
npm run build      # client + server bundle into dist/
npm run preview    # serve the production build
npm run lint       # type-check (tsc --noEmit)
```

The production build outputs a static client (`dist/`) plus a Node server (`dist/server.cjs`). Deploy the client to any static host and run the server as a standard Node process.

## Project Structure

```
src/
  components/        UI: uploader, extraction pipeline, structured viewer, navbar, footer
  lib/               AI client + document parsing logic
  data/              Sample document library
  types/             Shared TypeScript types
public/
  favicon.svg        Velcora brand icon
server.ts            Backend: AI analysis + webhook proxy
```

## Brand

Velcora is an AI automation brand. This workbench is a flagship demo of enterprise document intelligence. Logo and name are property of Velcora.

---

<p align="center">Built by Velcora — extract. audit. automate.</p>
