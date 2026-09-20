# UnderRight

**Explainable AI-Powered Credit Intelligence**

UnderRight is a hackathon prototype for next-generation credit underwriting. It is designed to support **New-to-Credit (NTC)** and **thin-file** applicants by combining structured applicant information, alternative financial signals, deterministic credit scoring, and explainable AI.

The project focuses on making credit decisions easier to understand for an underwriter while keeping the core score transparent, reproducible, and independent of the LLM.

---

## Current Project Status

The application has been implemented partially.

### Phase 1 — Project Foundation

Completed:

- React frontend created with Vite
- Tailwind CSS configured
- Node.js and Express backend created
- PostgreSQL connection pool configured
- Environment-based configuration added
- Backend health endpoint added
- CORS configured
- Helmet security middleware added
- API rate limiting added
- Frontend and backend can run independently in local development

### Phase 2 — Database and Credit Scoring Foundation

Completed:

- PostgreSQL database schema created
- `applications` table created
- `assessments` table created
- `chat_messages` table created for future copilot conversations
- Synthetic demo applicant data added
- Deterministic credit scoring service implemented
- Overall score normalized to a 0–100 range
- Risk bands derived from the deterministic score
- Scoring split into five explainable components

Current scoring components:

1. Income and employment stability
2. Debt capacity
3. Payment behaviour
4. Cash-flow stability
5. Account stability

Each component contributes up to 20 points.

> The credit score is calculated by application logic, not by the LLM. AI is intended to explain the result and assist the underwriter, not silently change the score.

### Phase 3 — Frontend Application Shell and Authentication

Completed:

- React application shell
- Demo authentication flow
- Protected application routing
- Navigation/layout structure
- Frontend structure for the underwriting workflow
- API-ready frontend organization
- Initial UI foundation for the remaining credit intelligence features

---

## Problem Statement

Traditional credit models depend heavily on established credit history. This can disadvantage New-to-Credit and thin-file applicants even when they may have stable income, responsible cash-flow behaviour, or other positive financial signals.

UnderRight explores a more contextual underwriting workflow by combining:

- Traditional applicant information
- Alternative data signals
- Deterministic risk scoring
- Explainable score components
- AI-generated explanations
- An underwriter copilot

The goal is to support better-informed decisions while maintaining transparency and responsible AI practices.

---

## High-Level Architecture

```text
                    ┌──────────────────────────┐
                    │        React UI          │
                    │   Vite + Tailwind CSS    │
                    └────────────┬─────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌──────────────────────────┐
                    │    Node.js + Express     │
                    │        Backend           │
                    └───────┬─────────┬────────┘
                            │         │
                            │         │
                            ▼         ▼
               ┌────────────────┐   ┌──────────────────┐
               │ Credit Scoring │   │   Gemini AI      │
               │     Engine     │   │ Explanation /    │
               │ Deterministic  │   │ Copilot - Later  │
               └───────┬────────┘   └──────────────────┘
                       │
                       ▼
               ┌──────────────────┐
               │    PostgreSQL    │
               │ Applications     │
               │ Assessments      │
               │ Chat Messages    │
               └──────────────────┘
```

---

## Technology Stack

### Frontend

- React JS
- Vite
- Tailwind CSS
- React Router
- Recharts planned for analytics and score visualizations

### Backend

- Node.js
- Express.js
- REST APIs
- Helmet
- CORS
- Rate limiting

### Database

- PostgreSQL

### AI Layer

- Google Gemini API
- AI explanations
- Underwriter Copilot

The AI layer is intentionally separated from the deterministic scoring logic.

---

## Project Structure

```text
underright/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

The exact folders may evolve as later phases are implemented.

---

## Credit Scoring Design

UnderRight currently uses a deterministic scoring model with a maximum score of **100**.

```text
Income / Employment Stability     20
Debt Capacity                     20
Payment Behaviour                 20
Cash-flow Stability               20
Account Stability                 20
                                  ---
Total                            100
```

This approach provides several advantages:

- Reproducible scoring
- Clear score breakdown
- Easier debugging
- Better transparency
- Reduced dependence on opaque AI decisions

The LLM will not calculate or overwrite the applicant's core credit score.

---

## Responsible AI Approach

UnderRight is being designed around the principle that AI should **assist an underwriter, not replace accountable decision-making**.

Current design principles include:

- Deterministic scoring outside the LLM
- Clear factor-level explanations
- AI output treated as supporting information
- No hidden modification of applicant scores
- Separation of structured calculations from generated text
- Synthetic data for the hackathon prototype
- Human review remains part of the underwriting workflow

Future phases will add more explicit AI guardrails and response constraints.

---

## Explainability

Explainability is a core part of the project.

Instead of displaying only a single credit score, UnderRight is designed to show:

- Overall score
- Risk band
- Individual scoring components
- Positive factors
- Risk factors
- Applicant-level context
- AI-generated plain-English explanation in a later phase

This allows the underwriter to understand **why** a score was produced.

---

## Security Practices

The current implementation includes or is structured around:

- Environment variables for configuration
- No API keys committed to source control
- `.env` excluded through `.gitignore`
- `.env.example` for configuration documentation
- Helmet security headers
- CORS configuration
- API rate limiting
- Server-side access to AI credentials
- PostgreSQL credentials kept outside source code

Never commit actual database passwords, Gemini API keys, JWT secrets, or other credentials.

---

## Local Development

### Prerequisites

Install:

- Node.js
- npm
- PostgreSQL
- Git

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd underright
```

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

Create the backend environment file from the example configuration.

```bash
cp .env.example .env
```

On Windows Command Prompt, you can instead use:

```cmd
copy .env.example .env
```

Fill the `.env` file with your own local configuration.

---

## 3. Set Up PostgreSQL

Create a PostgreSQL database for the project.

Then run the schema:

```bash
psql -U postgres -d underright -f database/schema.sql
```

Load the synthetic demo data:

```bash
psql -U postgres -d underright -f database/seed.sql
```

If your database name or PostgreSQL user is different, update the command accordingly.

---

## 4. Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend currently runs locally on port `5000` unless configured otherwise.

Health check:

```text
GET /api/health
```

---

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

Create the frontend environment file if required:

```bash
cp .env.example .env
```

On Windows:

```cmd
copy .env.example .env
```

---

## 6. Start the Frontend

From the `client` directory:

```bash
npm run dev
```

Vite normally starts the development application at:

```text
http://localhost:5173
```

---

## Environment Variables

Actual credentials must stay inside local `.env` files and must **not** be committed.

Example backend configuration may include:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

Example frontend configuration may include:

```env
VITE_API_URL=http://localhost:5000/api
```

Use the variable names already defined by the project's `.env.example` files if they differ.

---

## API Direction

The project is designed around an API-first architecture.

Current and planned API areas include:

```text
POST /api/auth/login
GET  /api/health

GET  /api/dashboard

POST /api/applications
GET  /api/applications
GET  /api/applications/:id

POST /api/applications/:id/explanation
POST /api/applications/:id/chat
GET  /api/applications/:id/chat
```

Some endpoints belong to later implementation phases and may not yet be active.

---

## Demo Data

The project uses synthetic applicant records for development and demonstration.

No real customer financial information is required for the hackathon prototype.

The demo data is intended to include applicants across different risk profiles so the UI can demonstrate:

- Strong applicants
- Medium-risk applicants
- Higher-risk applicants
- Different score component combinations

---

## Testing

Basic test coverage will be added as the implementation progresses.

Planned coverage includes:

- Health endpoint
- Authentication
- Credit score calculation
- Risk-band calculation
- Application API validation
- AI response guardrails

---

## Version Control

The project uses Git and GitHub for version control.

Recommended commit style:

```text
Initial project setup
Add PostgreSQL schema and seed data
Add deterministic credit scoring engine
Add authentication and protected routes
Add applicant dashboard
Add explainable credit assessment UI
Add Gemini explanation service
Add underwriter copilot
Add API tests and validation
Update documentation
```

---

## Planned Next Steps

The next development phases will focus on completing the underwriting experience, including:

- Applicant dashboard
- Applicant detail view
- Credit assessment visualization
- Recharts-based analytics
- Explainable score breakdown
- Gemini-powered explanation generation
- Underwriter Copilot
- Additional validation and guardrails
- Unit/API tests
- Final architecture documentation
- Deployment preparation
- Demo-ready polish

---

## Deployment Direction

The project is being structured so it can later be deployed using:

- **Frontend:** Vercel
- **Backend:** Render or equivalent
- **Database:** Supabase PostgreSQL or equivalent

The immediate development environment remains local.

---

## Hackathon Focus

The prototype is being built around the following engineering priorities:

- Clean and modular code
- Meaningful naming conventions
- API-first design
- Git/GitHub version control
- Clear README documentation
- Simple setup and run instructions
- Architecture documentation
- Basic test coverage
- Secure credential handling
- Responsible AI
- Explainability and transparency

---

## Project

**UnderRight**  
*Explainable AI-Powered Credit Intelligence*
