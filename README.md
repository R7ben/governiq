# GovernIQ

GovernIQ is an AI governance intelligence and decision-support prototype for Malaysian organisations. It helps users benchmark governance, sustainability, and ESG readiness, identify maturity gaps, and choose credible next actions.

> **Important:** The current company universe and benchmark values are illustrative demo fixtures. GovernIQ is not investment advice, compliance certification, or legal advice.

## Features

The dashboard provides an overview of the seven-construct model, benchmark coverage, ranked signals, a maturity pulse, searchable company explorer, and a clear data-quality disclosure. Company profiles retain the existing detail experience and a fast AI Advisor that answers focused governance questions and includes contextual FAQs. The readiness review is a multi-step, session-only self-assessment with 20 maturity statements, explicit consent, 1–5 responses, a seven-construct profile, status classification, and practical action prompts. The methodology page explains the scoring model, evidence boundaries, limitations, and distinction between benchmark intelligence and certification.

## Architecture

The application uses Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, Recharts, and the Vercel AI SDK. Demo company fixtures live in `src/data/companies.json`. Shared domain types are in `src/types/company.ts`; deterministic score calculations are isolated in `src/lib/scoring.ts` and covered by Vitest tests. AI generation remains server-side in `src/app/api/advisor/route.ts` and `src/app/api/memo/route.ts`, where request fields are bounded and validated before being placed into prompts.

The current readiness flow does not persist submissions. It explicitly records that results are session-only and requires consent before generating the readout. A production implementation should add a reviewed data model, authenticated access, source provenance, retention controls, and a validated dataset before storing or publishing results.

## Local development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The AI routes require the provider environment expected by `@ai-sdk/groq`; do not commit API keys or local environment files.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

The unit tests cover maturity conversion, status thresholds, overall score calculation, weakest-construct selection, ranked gaps, and readiness aggregation.

## Demo-data limitation

The repository includes 12 seeded company records across multiple sectors so the interface can be evaluated without an external data connection. These records are not a live Bursa Malaysia dataset and should not be interpreted as real company scores, benchmark results, compliance claims, or investment signals. Replace the fixtures only after documenting the source, reference period, sampling frame, evidence provenance, and validation method.

## Deployment

The project is compatible with a standard Vercel Next.js deployment. Configure the server-side AI provider secret in the deployment environment, review provider quotas, and protect AI routes with authentication, rate limits, request-size limits, and observability before public launch.
