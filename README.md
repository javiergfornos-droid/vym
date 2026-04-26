# VYM — Vector Your Model

Initial foundation for a premium bilingual financial valuation web app.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Development

```bash
npm install
npm run dev
```

## Routes included in stage 1

- Landing shell: `/`
- Wizard shells:
  - `/wizard/intro`
  - `/wizard/company-identification`
  - `/wizard/unit-fiscal-year`
  - `/wizard/income-statement`
  - `/wizard/balance-sheet`
  - `/wizard/transition-assumptions`
  - `/wizard/revenue-assumptions`

Each route supports `?lang=es` and `?lang=en`.

## Deployment

Ready for Vercel deployment with standard Next.js build scripts.
