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

Customer specificity takes priority over product specificity. A profile targeting a specific customer beats one targeting a customer group, which beats one targeting all customers. Within the same customer specificity level, a profile targeting a specific product beats one targeting a category, which beats all products. If two profiles score equally on both dimensions, the one resulting in the greatest saving for the customer wins. Prices are never negative.

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

## API Endpoints

| Method | Endpoint                                 | Description                            |
| ------ | ---------------------------------------- | -------------------------------------- |
| POST   | /auth/login                              | Login with credentials                 |
| GET    | /products                                | Get all products with optional filters |
| GET    | /products/:id                            | Get single product                     |
| GET    | /profiles                                | Get all pricing profiles               |
| GET    | /profiles/:id                            | Get single profile                     |
| POST   | /profiles                                | Create pricing profile                 |
| PUT    | /profiles/:id                            | Update pricing profile                 |
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

## What I'd Do Next

**Persistence** — Replace the in-memory store with PostgreSQL. The data models are already clean and typed so the migration would be straightforward.

**Structured logging** — Replace console.error with Winston, writing timestamped logs to a file with log levels for better observability in production.

**Testing** — Add unit tests for the price resolver covering all precedence rule scenarios, and integration tests for the API endpoints. The resolver is the most critical piece of business logic and deserves the most test coverage.

**Auth improvements** — Implement JWT tokens with refresh token rotation and bcrypt password hashing. Add a proper user management flow.

**Real customer management** — Currently customers are hardcoded in seed data. In production customers would be managed via their own CRUD endpoints and linked to profiles via foreign keys.

## AI Transcript

Full Claude.ai conversation transcript: https://claude.ai/share/0dc1ac33-b979-4e32-a4f9-b4de40fa9de3
