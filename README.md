# UNDER RIGHT

### Explainable AI-Powered Credit Intelligence

UnderRight is a hackathon prototype for explainable, multi-signal credit intelligence and human-centered underwriting support.

The system combines structured application information, cash-flow indicators and alternative financial signals to generate a transparent Credit Intelligence Score.

The numerical assessment is produced by a deterministic and configurable scoring engine. Google Gemini is used separately to explain the assessment and provide an application-specific Underwriter Copilot.

> UnderRight is a prototype decision-support system. It is not a production credit-risk model and does not automatically approve or reject credit.

---

## Problem

Traditional credit underwriting can depend heavily on conventional credit history.

Applicants with limited traditional history may nevertheless have useful financial signals such as:

- recurring income
- account cash flow
- payment consistency
- existing debt burden
- account stability
- utility payment behaviour

UnderRight demonstrates how these signals can be combined into a transparent prototype assessment while preserving human oversight.

---

## Solution

UnderRight provides:

- deterministic Credit Intelligence scoring
- component-level explainability
- positive and attention signals
- transparent scoring calculations
- application history
- portfolio dashboard analytics
- AI-generated underwriter explanations
- application-specific Underwriter Copilot
- human-in-the-loop decision support

The generative AI layer is deliberately separated from the numerical scoring engine.

---

## Core Design Principle

```text
Applicant Financial Data
          |
          v
Deterministic Scoring Engine
          |
          +---- Credit Intelligence Score
          +---- Risk Classification
          +---- Component Scores
          +---- Positive Signals
          +---- Attention Signals
          |
          v
      PostgreSQL
          |
          +---------------------------+
          |                           |
          v                           v
Dashboard / History             Gemini API
                                Explanation
                                Copilot
```

Gemini receives the completed deterministic assessment as read-only context.

Gemini does not calculate or alter the numerical score.

---

## Architecture

```text
+------------------------------------------------+
|                React Frontend                  |
|                                                |
| Login                                          |
| Dashboard                                      |
| New Assessment                                 |
| Assessment Results                             |
| Application History                            |
| Application Details                            |
| Underwriter Copilot                            |
+------------------------+-----------------------+
                         |
                         | REST / JWT
                         v
+------------------------------------------------+
|              Node.js / Express API             |
|                                                |
| Authentication                                 |
| Input Validation                               |
| Application APIs                               |
| Dashboard Aggregation                          |
|                                                |
|  +-------------------+  +-------------------+  |
|  | Scoring Service   |  | Gemini Service    |  |
|  |                   |  |                   |  |
|  | Deterministic     |  | Explanation       |  |
|  | Score: 0 - 100    |  | Copilot           |  |
|  +---------+---------+  +---------+---------+  |
+------------|----------------------|------------+
             |                      |
             v                      v
       PostgreSQL              Gemini API
```

---

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React
- React Markdown

### Backend

- Node.js
- Express.js
- JavaScript
- PostgreSQL
- node-postgres (`pg`)
- Zod
- JSON Web Tokens
- Helmet
- Express Rate Limit

### AI

- Google Gemini API
- `@google/genai`

### Deployment Design

- Frontend: Vercel
- Backend: Render
- Database: Supabase PostgreSQL

---

## Main Features

### Demo Authentication

UnderRight includes a simple JWT-based demo underwriter login suitable for hackathon demonstration.

Credentials are supplied using environment variables rather than committed source code.

### Dashboard

The dashboard includes:

- total applications
- average Credit Intelligence Score
- low-risk applications
- moderate-risk applications
- higher-risk applications
- risk distribution
- score distribution
- assessment activity
- recent applications

Dashboard information is retrieved from PostgreSQL through the backend API.

### New Credit Assessment

The assessment workflow captures:

Applicant information:

- applicant name
- optional email
- employment type
- employment duration
- credit purpose

Financial information:

- monthly income
- requested amount
- existing monthly debt
- average monthly balance

Cash-flow information:

- monthly credits
- monthly debits
- income regularity

Payment and account information:

- utility payment rate
- missed payments
- account age

Protected demographic attributes are not collected.

Applicant name and email are excluded from scoring.

---

## Credit Intelligence Scoring

The prototype uses five components worth up to 20 points each.

```text
Income / Employment Stability     20
Debt Capacity                     20
Payment Behaviour                 20
Cash Flow Stability               20
Account Stability                 20
                                  ---
Total                            100
```

### Risk Bands

```text
80 - 100    Low Risk
65 - 79     Moderate-Low Risk
50 - 64     Moderate Risk
35 - 49     High Risk
0  - 34     Very High Risk
```

These ranges are configurable prototype rules and are not presented as production lending standards.

---

## Example Assessment

Example input:

```text
Employment duration       24 months
Monthly income            ₹60,000
Requested credit          ₹120,000
Existing monthly debt     ₹10,000
Average balance           ₹28,000
Monthly credits           ₹65,000
Monthly debits            ₹42,000
Income regularity         High
Utility payment rate      96%
Missed payments           1
Account age               30 months
```

Example deterministic result:

```text
Income Stability          17 / 20
Debt Capacity             14 / 20
Payment Behaviour         17 / 20
Cash Flow Stability       17 / 20
Account Stability         14 / 20

Total                     79 / 100

Risk Classification:
Moderate-Low Risk
```

---

## Explainability

Every generated assessment includes:

- component scores
- positive signals
- risk / attention signals
- observed financial ratios
- exact points awarded for each rule
- calculation transparency

This means the score remains understandable even when Gemini is unavailable.

---

## Gemini Integration

Gemini has two roles.

### AI Assessment Explanation

Gemini receives:

- application financial information
- completed deterministic score
- risk classification
- component scores
- positive factors
- attention factors
- calculation details

It converts these supplied facts into a concise explanation for a human underwriter.

### Underwriter Copilot

The Copilot allows application-specific questions such as:

```text
Why was this applicant classified at this risk level?

What are the strongest positive indicators?

How is the debt burden affecting the assessment?

What should an underwriter verify manually?

Summarize this application.
```

Copilot conversations are persisted in PostgreSQL.

---

## Gemini Guardrails

The Gemini system instructions require that it:

1. never recalculates the Credit Intelligence Score
2. never modifies the score
3. never changes the supplied risk classification
4. never approves credit
5. never rejects credit
6. never invents applicant information
7. does not infer protected characteristics
8. explicitly states when requested information is unavailable
9. uses neutral professional language
10. preserves human decision authority

---

## Responsible AI Principles

UnderRight was designed around the following principles.

### No protected characteristics

The scoring engine does not use:

- race
- ethnicity
- religion
- caste
- gender
- sexual orientation

### Identity fields do not affect scoring

Applicant name and email are stored only for workflow purposes.

They are not supplied to the deterministic scoring calculations.

### Transparent decision logic

Every score is decomposed into understandable components and rules.

### Generative AI is outside the decision engine

Gemini receives the already-calculated score.

A hallucinated explanation cannot modify the underlying numerical assessment.

### Human oversight

UnderRight does not automatically approve or reject applications.

The final lending decision belongs to an authorized human or governed decision process.

### Synthetic demonstration data

The seeded application records are fictional and intended only for demonstration.

---

## Why We Did Not Train a Custom ML Model

The prototype intentionally avoids training a credit-risk model on arbitrary synthetic data.

A model trained on artificial labels would not provide meaningful evidence of real-world credit-risk performance.

Instead, UnderRight uses an explicit scoring service whose behaviour is deterministic and explainable.

The architecture is modular, so the scoring service could later be supplemented or replaced with a properly validated credit-risk model without requiring major changes to the frontend or application workflow.

---

## Project Structure

```text
underright/
|
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |
|   |-- .env.example
|   |-- vercel.json
|   `-- package.json
|
|-- server/
|   |-- database/
|   |   |-- schema.sql
|   |   `-- seed.sql
|   |
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- validators/
|   |   |-- app.js
|   |   `-- server.js
|   |
|   |-- .env.example
|   `-- package.json
|
|-- render.yaml
|-- .gitignore
`-- README.md
```

---

## Local Setup

### Requirements

Install:

- Node.js
- npm
- PostgreSQL
- Git

---

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd underright
```

---

### 2. Create PostgreSQL database

```sql
CREATE DATABASE underright;
```

Run:

```text
server/database/schema.sql
```

and then:

```text
server/database/seed.sql
```

against the database.

The seed script creates fictional demo applications for dashboard and history demonstration.

---

### 3. Configure backend

```bash
cd server
npm install
```

Copy:

```text
.env.example
```

to:

```text
.env
```

Configure:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/underright
DATABASE_SSL=false

CLIENT_URLS=http://localhost:5173

JWT_SECRET=YOUR_SECRET
JWT_EXPIRES_IN=8h

DEMO_USER_NAME=Demo Underwriter
DEMO_USER_EMAIL=underwriter@underright.demo
DEMO_USER_PASSWORD=YOUR_DEMO_PASSWORD

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.5-flash-lite
```

Run:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

### 4. Configure frontend

Open another terminal:

```bash
cd client
npm install
```

Copy:

```text
.env.example
```

to:

```text
.env
```

Configure:

```env
VITE_API_URL=http://localhost:5000/api

VITE_DEMO_EMAIL=underwriter@underright.demo
VITE_DEMO_PASSWORD=YOUR_DEMO_PASSWORD
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API Overview

```text
POST /api/auth/login

GET  /api/dashboard

POST /api/applications

GET  /api/applications

GET  /api/applications/:id

POST /api/applications/:id/explanation

GET  /api/applications/:id/chat

POST /api/applications/:id/chat

GET  /api/health
```

Protected endpoints require:

```text
Authorization: Bearer <JWT>
```

---

## Database Tables

### applications

Stores submitted application and financial information.

### assessments

Stores:

- deterministic score
- risk classification
- five component scores
- positive factors
- attention factors
- calculation details
- persisted AI explanation

### chat_messages

Stores application-specific Copilot conversations.

---

## Security Basics

The prototype includes:

- environment-based secrets
- JWT authentication
- protected backend routes
- backend input validation
- parameterized PostgreSQL queries
- CORS configuration
- Helmet security headers
- API rate limiting
- server-side Gemini integration
- hidden Gemini API credentials
- sanitized server errors

This authentication design is intended for a hackathon prototype, not production identity management.

---

## Deployment

### Database — Supabase

Create a Supabase project.

Run:

```text
server/database/schema.sql
```

through the Supabase SQL Editor.

Optionally run:

```text
server/database/seed.sql
```

for demo records.

Configure the Render backend:

```env
DATABASE_URL=<Supabase PostgreSQL connection string>
DATABASE_SSL=true
```

---

### Backend — Render

Deploy the repository to Render.

Configuration:

```text
Root Directory:
server

Build Command:
npm install

Start Command:
npm start

Health Check:
 /api/health
```

Configure all backend environment variables in Render.

Do not commit API keys or database credentials.

---

### Frontend — Vercel

Deploy the repository to Vercel using:

```text
Root Directory:
client
```

Set:

```env
VITE_API_URL=https://YOUR_RENDER_BACKEND/api
```

The included `vercel.json` enables React Router page refreshes.

After receiving the Vercel domain, configure the backend:

```env
CLIENT_URLS=https://YOUR_PROJECT.vercel.app
```

For local and production access simultaneously:

```env
CLIENT_URLS=http://localhost:5173,https://YOUR_PROJECT.vercel.app
```

---

## Prototype Limitations

UnderRight is intentionally limited in several ways.

It does not include:

- a validated production credit-risk model
- actual credit bureau integration
- actual banking integrations
- regulatory lending policy
- production authentication
- advanced RBAC
- production audit infrastructure
- fairness monitoring
- automated lending decisions
- real applicant data

The deterministic scoring thresholds are demonstration rules rather than validated underwriting standards.

---

## Future Work

Possible extensions include:

- validated machine-learning underwriting models
- real banking data integrations
- credit bureau APIs
- transaction ingestion
- advanced role-based access
- audit logging
- fairness monitoring
- model governance
- pgvector-based similar-case retrieval
- production identity providers
- AWS Bedrock
- AWS RDS
- AWS Secrets Manager
- real-time financial-data ingestion

---

## Key Architectural Principle

> We intentionally separated the decision engine from the generative AI layer. The prototype uses a transparent, configurable scoring engine to generate the Credit Intelligence Score. Gemini is used only to make the underlying factors easier for human underwriters to understand and investigate. This prevents an LLM hallucination from changing the underlying assessment.

We also intentionally avoided training a custom credit model on arbitrary synthetic data because that would not provide meaningful production credit-risk performance.

The scoring service is modular and can later be replaced or supplemented by a properly validated model without changing the frontend, APIs or overall workflow.

---

## Disclaimer

UnderRight is a hackathon prototype built using synthetic demonstration data.

It is not designed or validated for real lending decisions.