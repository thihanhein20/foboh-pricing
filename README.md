# FOBOH Pricing

A fullstack pricing profile management app for food and beverage wholesalers. Built as a technical challenge using React, Node.js and TypeScript.

## What it does

Suppliers can create customer-specific pricing profiles, apply fixed or dynamic price adjustments, and resolve the effective price when multiple profiles overlap for the same customer and product.

## Live Demo

|              | URL                                               |
| ------------ | ------------------------------------------------- |
| Frontend     | https://foboh-pricing.vercel.app                  |
| API          | https://api-foboh-pricing.up.railway.app          |
| Swagger Docs | https://api-foboh-pricing.up.railway.app/api-docs |

> **Note:** The backend is hosted on Railway's free tier which hibernates after inactivity. If the app feels slow on first load, wait 10-15 seconds for the server to wake up. Because the store is in-memory, any profiles created before hibernation will be reset. Use the seed profiles described in the test guide to get started quickly.

## Tech Stack

**Backend**

- Node.js + TypeScript
- Express.js
- In-memory store
- Swagger / OpenAPI 3.0

**Frontend**

- React + TypeScript
- Tailwind CSS
- Axios
- React Router

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Run the backend

```bash
cd backend
npm install
npm run dev
```

Server runs on http://localhost:3000
Swagger docs at http://localhost:3000/api-docs

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on http://localhost:5173

### Login credentials

```
email : admin@foboh.com
password : foboh2026
```

## Precedence Rule

When multiple pricing profiles match a customer and product, the following rule applies:

Customer specificity takes priority over product specificity because a direct deal with a named customer represents the most intentional commercial commitment — a custom price negotiated with Bondi Cellars directly should never be silently overridden by a group discount. Within the same customer level, a specific product scope beats a category, which beats all products, for the same reason: the more deliberate the targeting, the stronger the intent. When two profiles score equally on both dimensions, the customer receives the greater saving. This prevents accidental overcharges when overlapping rules of equal specificity exist, and reflects the commercial reality that a supplier would rather honour the better deal than produce an arbitrary outcome. Prices are never negative.

**Scoring:**

- specific = 3
- group / category = 2
- all = 1

Customer scope weighs more than product scope. Final score = (customerScore × 10) + productScore.

**Example from the brief:**

Bondi Cellars is in both Independent Retailers and VIP groups. They order Koyama Methode Brut Nature NV ($120.00). Three profiles match:

| Profile                        | Customer Scope | Product Scope | Score | Result |
| ------------------------------ | -------------- | ------------- | ----- | ------ |
| Custom price for Bondi Cellars | specific (3)   | specific (3)  | 33    | Winner |
| $15 off Sparkling Wine for VIP | group (2)      | category (2)  | 22    | Loses  |
| 10% off all Wine               | group (2)      | all (1)       | 21    | Loses  |

Bondi Cellars pays **$95.00**. Profile C wins because it is the most specific — one customer, one product.

Another engineer could implement this rule without asking questions:

1. Score each matching profile using (customerScope × 10) + productScope
2. Sort descending by score
3. If scores are equal, sort by greatest saving
4. Take the first result
5. Ensure the final price is never below zero

**"All Products" over time** — a profile with `productScope: "all"` applies to every product that exists at resolve time, including products added after the profile was created. This is deliberate: a rule like "10% off all Wine" should cover new vintages automatically. Suppliers who want to exclude future products should use `specific` or `category` scope instead.

## API Endpoints

| Method | Endpoint                                 | Description                            |
| ------ | ---------------------------------------- | -------------------------------------- |
| POST   | /auth/login                              | Login with credentials                 |
| GET    | /products                                | Get all products with optional filters |
| GET    | /products/:id                            | Get single product                     |
| GET    | /profiles                                | Get all pricing profiles               |
| GET    | /profiles/:id                            | Get single profile                     |
| POST   | /profiles                                | Create pricing profile                 |
| PATCH  | /profiles/:id                            | Update pricing profile                 |
| DELETE | /profiles/:id                            | Delete pricing profile                 |
| GET    | /profiles/resolve/:customerId/:productId | Resolve effective price                |

Full API documentation available at /api-docs

## Folder Structure

## Project Structure

```
foboh-pricing/
│
├── backend/
│   └── src/
│       ├── config/         # Auth credentials config
│       ├── data/           # Seed products and customers
│       ├── middleware/     # JWT auth middleware
│       ├── models/         # TypeScript interfaces
│       ├── routes/         # Express route handlers
│       ├── services/       # Price resolver logic
│       ├── swagger/        # OpenAPI YAML spec
│       └── utils/          # Validation and logger
│
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI components
│       │   ├── AdjustmentControls/
│       │   ├── CustomerScope/
│       │   ├── Layout/
│       │   ├── PricePreview/
│       │   ├── ProductFilter/
│       │   ├── ProductList/
│       │   ├── ResolveModal/
│       │   └── Sidebar/
│       ├── pages/          # Page level components
│       │   ├── Login/
│       │   └── Pricing/
│       ├── services/       # Axios instance and API calls
│       └── types/          # Shared TypeScript types
│
└── transcripts/            # AI conversation transcripts
```

## Deliberate Tradeoffs

**In-memory store** — Data resets on server restart. Acceptable for this challenge. In production this would use PostgreSQL with a proper schema.

**Hardcoded credentials** — Auth uses a single hardcoded user. In production this would use a user table with bcrypt hashed passwords and JWT tokens.

**No pagination** — Product and profile lists load all records. Acceptable at this data scale. In production pagination would be added.

**Swagger in separate YAML** — API documentation is kept in openapi.yaml following API-first design principles, keeping route handlers clean and allowing the spec to be used independently of the implementation.

**Validation in separate utility** — Profile validation uses a rules array pattern instead of chained if statements, making it easy to add or modify rules without touching the validation function itself.

**Global error handler** — Kept in index.ts for simplicity. In a larger codebase this would be extracted into a dedicated middleware folder.

**Deleted product references** — When `productScope` is `specific`, `productIds` are validated against the in-memory seed at write time, so a profile referencing a non-existent product is rejected on creation. This is an application-layer referential integrity check that stands in for a foreign key constraint, which a real database would enforce automatically. At resolve time, a profile whose stored `productIds` no longer match any product simply returns no match and is skipped — the resolver never crashes, it just treats the profile as non-applicable. This is the correct read-time behaviour: a stale profile should not block price resolution for other valid profiles.

**Score and savings tie** — When two profiles score equally on both customer and product specificity and produce identical savings, the resolver falls back to insertion order. This is deterministic within a session but could vary if profiles are loaded in a different order across restarts. In production, a stable third tiebreaker such as `createdAt` ascending (oldest rule wins as the established baseline) would eliminate this ambiguity.

**Product ID reuse** — If a product is removed and its ID later reused for a new product, any zombie profiles referencing the original would silently start matching the new one. In production this is prevented by foreign key constraints and soft deletes rather than hard deletion of referenced records.

## What I'd Do Next

**Persistence** — Replace the in-memory store with PostgreSQL. The data models are already clean and typed so the migration would be straightforward.

**Structured logging** — Replace console.error with Winston, writing timestamped logs to a file with log levels for better observability in production.

**Testing** — Add unit tests for the price resolver covering all precedence rule scenarios, and integration tests for the API endpoints. The resolver is the most critical piece of business logic and deserves the most test coverage.

**Auth improvements** — Implement JWT tokens with refresh token rotation and bcrypt password hashing. Add a proper user management flow.

**Real customer management** — Currently customers are hardcoded in seed data. In production customers would be managed via their own CRUD endpoints and linked to profiles via foreign keys.

## AI Transcript

Full Claude.ai conversation transcript: https://claude.ai/share/0dc1ac33-b979-4e32-a4f9-b4de40fa9de3
