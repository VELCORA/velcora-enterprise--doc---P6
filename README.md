<div align="center">
  <img src="public/favicon.svg" alt="Velcora" width="120" height="120" />
</div>

<h1 align="center">Velcora — Enterprise Document Processing & Automation Workbench</h1>

<div align="center">
  AI-powered document intelligence that turns enterprise paperwork into clean, validated, automation-ready data.
</div>

---

## What it is

Velcora Document Processing is a workbench for finance and operations teams that handle large volumes of enterprise documents — invoices, purchase orders, bank statements, and tax forms. Instead of keying data by hand, a team uploads a document and receives a structured, audited extract ready to flow into their systems.

## Who it's for

- Finance teams processing vendor invoices and statements
- Operations teams reconciling purchase orders
- Agencies and consultancies that audit client documents
- Any business drowning in manual data entry

## What it does for your business

- **AI Extraction** — reads each document and pulls line items, totals, tax, and vendor fields automatically.
- **Risk & Anomaly Audit** — flags duplicate line items, tax mismatches, and missing fields before they reach your books.
- **Structured Viewer** — presents the extracted data as a clean, print-ready document with a Velcora watermark.
- **Live Processing View** — shows every stage in real time (scan → parse → structure → audit → enrich → done).
- **Sample Library** — ships with realistic sample documents so teams can see the pipeline in action immediately.
- **Automation Hook** — pushes validated extracts to any endpoint (ERP, accounting tool, or custom webhook).

## Why it matters

Manual document entry is slow and error-prone. Velcora reduces hours of work to seconds and catches costly mistakes before they happen — so the team spends time on decisions, not data entry.

## Launch & Deployment

The product runs as a web application. A Google Gemini API key powers the AI extraction.

```bash
npm install
# Add GEMINI_API_KEY to .env.local
npm run dev
```

To ship a production build:

```bash
npm run build      # client + server bundle into dist/
npm run preview    # serve the production build
npm run lint       # type-check
```

The build outputs a static client (`dist/`) and a Node server (`dist/server.cjs`). The client deploys to any static host; the server runs as a standard Node process.

## Technical notes

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **AI:** Google Gemini 2.5-flash
- **Backend:** Node/Express (`server.ts`) for analysis + webhook proxy

## Brand

Velcora is an AI automation brand. This workbench is a flagship demonstration of enterprise document intelligence. Logo and name are property of Velcora.

---

<p align="center">Built by Velcora — extract. audit. automate.</p>
