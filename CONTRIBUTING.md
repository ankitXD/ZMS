# Contributing to ZMS (Zoo Verse)

Welcome! 🎉 Thank you for taking the time to contribute to **ZMS — Zoo Management System**. This document explains how to set up the project, follow our conventions, add features, submit changes, and report issues.

> If you're here for a _quick fix_ (typo / small patch), you can skip to [Pull Request Checklist](#pull-request-checklist).

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Monorepo Layout](#monorepo-layout)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Variables](#environment-variables)
- [Running the Apps](#running-the-apps)
- [Branching Strategy](#branching-strategy)
- [Commit Message Convention](#commit-message-convention)
- [Coding Standards](#coding-standards)
- [Frontend Guidelines](#frontend-guidelines)
- [Backend Guidelines](#backend-guidelines)
- [Adding a New API Endpoint](#adding-a-new-api-endpoint)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Testing (Planned)](#testing-planned)
- [API Testing (Postman Collection)](#api-testing-postman-collection)
- [Deployment Flow](#deployment-flow)
- [Security & Secrets](#security--secrets)
- [Issue Reporting](#issue-reporting)
- [Pull Request Checklist](#pull-request-checklist)
- [Release & Versioning](#release--versioning)
- [FAQ](#faq)

---

## Project Overview

ZMS is a full‑stack platform for:

- Public users: view animals, contact the zoo, book tickets (orders initially pending).
- Admin staff: manage animals, orders/payments, messages, and other administrators using RBAC (`owner`, `admin`, `editor`).

Key features include JWT auth with access & refresh tokens (cookie-based), admin management, animals catalog, ticket ordering, and upcoming payment + QR workflows.

---

## Architecture & Tech Stack

| Layer        | Stack                                                                            |
| ------------ | -------------------------------------------------------------------------------- |
| Frontend     | React + Vite + React Router + Tailwind CSS + Zustand                             |
| Backend      | Node.js + Express + Mongoose (MongoDB)                                           |
| Auth         | JWT (access + refresh), httpOnly cookies                                         |
| File Uploads | Multer (local temp) + optional Cloudinary integration                            |
| State Mgmt   | Lightweight stores (Zustand) per domain: auth, animals, orders, admins, messages |
| Deployment   | Frontend (Vercel), Backend (Heroku)                                              |
| Tooling      | ESLint (flat config), Postman collection for API testing                         |

---

## Monorepo Layout

```
backend/
  src/
    controllers/   # Express handlers (pure logic & responses)
    routes/        # Route definitions (wiring middlewares + controllers)
    models/        # Mongoose schemas
    middlewares/   # Auth, multer, etc.
    utils/         # ApiResponse, ApiError, asyncHandler, cloudinary helpers
    db/            # Database connection
  package.json
frontend/
  src/
    pages/         # Route-level UI
    components/    # Reusable UI pieces
    store/         # Zustand stores
    utils/         # API instance, helpers
  public/          # Static assets (OG images, logos)
  package.json
CONTRIBUTING.md
README.md
```

---

## Prerequisites

- **Node.js**: >= 18.x (ensure consistent runtime)
- **npm**: >= 9.x
- **MongoDB**: Local instance or remote cluster (e.g., Atlas)
- **Git**
- (Optional) Cloudinary account for image hosting
- (Optional) Razorpay or other payment gateway (future enhancement)

---

## Initial Setup

```bash
# Clone
git clone https://github.com/<your-fork>/ZMS.git
cd ZMS

# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
```

Create `.env` inside `backend/` (see below). Then run both apps.

---

## Environment Variables

Create `backend/.env`:

```
MONGODB_URI=mongodb://localhost:27017/zms
ACCESS_TOKEN_SECRET=replace_with_strong_secret
REFRESH_TOKEN_SECRET=replace_with_strong_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
# Optional cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Do NOT** commit real secrets.

---

## Running the Apps

```bash
# Backend
cd backend
npm run dev   # Starts Express API with nodemon (if configured)

# Frontend
cd ../frontend
npm run dev   # Starts Vite dev server (default: http://localhost:5173)
```

Open http://localhost:5173

---

## Branching Strategy

- `main` — stable / deployable.
- Feature branches: `feat/<short-name>`
- Fixes: `fix/<issue-id>-short`
- Refactor: `refactor/<scope>`
- Chores/docs: `chore/<scope>` or `docs/<scope>`

Example:

```
feat/animals-bulk-upload
fix/123-login-null-ref
```

---

## Commit Message Convention

Follows a Conventional Commits‑style subset:

```
<type>(optional scope): concise description

Types: feat | fix | refactor | chore | docs | test | style | perf
```

Examples:

```
feat(auth): add admin list endpoint
fix(orders): prevent negative ticket quantity
refactor(store): normalize admin active flag
```

---

## Coding Standards

### General

- Keep controllers lean: validation, calling model/service, returning `ApiResponse`.
- Reuse `asyncHandler` to avoid repetitive try/catch.
- Use `ApiError` for predictable error structure.
- Avoid logic in routes — compose middlewares + controller only.

### Backend Style

- Use plural nouns for collections (e.g., `/api/v1/animals`).
- Restrict sensitive endpoints with `verifyJWT` + `requireAdminRole(...)`.
- Prefer pagination + filters (page, limit, q, sort) where lists may grow.
- Omit sensitive fields: `.select("-passwordHash -refreshToken")`.

### Frontend Style

- Co-locate minimal logic in pages; push reusable logic into stores or utils.
- Zustand store shape: loading flags, data arrays, single item, actions returning `{ ok, data, message }`.
- Use semantic accessible elements; add keyboard handlers where click replaced default navigation.
- Tailwind: group classes logically (layout → spacing → color → state).

---

## Frontend Guidelines

| Concern         | Pattern                                                             |
| --------------- | ------------------------------------------------------------------- |
| Data Fetch      | Call store action in `useEffect()` keyed by params                  |
| Prefetch Detail | `fetch<Domain>ById` before navigation (optimistic)                  |
| Auth Guard      | `ProtectedRoute` checks `authUser` & roles                          |
| RBAC            | Use `useAdminsStore().can('<permission>')`                          |
| Forms           | Controlled inputs; basic inline validation before API               |
| Navigation      | Use `<Link />`; for prefetch override default and navigate manually |

---

## Backend Guidelines

| Concern             | Pattern                                                     |
| ------------------- | ----------------------------------------------------------- |
| Auth                | `verifyJWT` extracts user from cookie or bearer             |
| RBAC                | `requireAdminRole('owner','admin')` etc.                    |
| File Upload         | `multer` -> temp file -> (optional) Cloudinary -> store URL |
| Pagination          | Query: `page`, `limit` (default 1 & 20) -> skip/limit       |
| Filtering           | Use `q` for regex search (case‑insensitive) on key fields   |
| Soft vs Hard Delete | Currently hard delete; consider soft in future              |

---

## Adding a New API Endpoint

1. **Model update** (if needed): `backend/src/models/<entity>.model.js`
2. **Controller**: Create handler in `controllers/` using `asyncHandler` + `ApiResponse`.
3. **Route**: Register under appropriate resource file in `routes/`.
4. **RBAC**: Decide which roles can access; add `requireAdminRole` accordingly.
5. **Postman**: Add or duplicate a request in the collection; document query/body.
6. **Frontend**: Add action in a store (e.g., `useXStore.js`). Return consistent shape.
7. **UI**: Wire into component/page; handle loading + error states.

---

## Role-Based Access Control (RBAC)

Current roles:

- **owner** — Full control, can register & delete admins, change roles.
- **admin** — Manage animals, orders, payments, update other admins (not owners).
- **editor** — Create/update animal text content; cannot upload images or delete.

Permissions are centralized in `useAdminsStore.js` (`PERMISSIONS` map). Frontend gates UI & actions; backend enforces via middleware.

---

## Testing (Planned)

Automated tests are not yet implemented. Proposed future stack:

- **Backend**: Jest + Supertest (API integration level)
- **Frontend**: Vitest + React Testing Library

When contributing new complex logic, consider adding a minimal Jest test harness inside `backend/__tests__/` or `frontend/src/__tests__/` (even if provisional).

---

## API Testing (Postman Collection)

A Postman collection is included (see repo root or `/docs` if moved). Import it and use environment variable `baseUrl` set to your local API (`http://localhost:5000/api/v1`). Log in with an owner account to access restricted routes.

---

## Deployment Flow

**Frontend (Vercel)**: Auto-deploys from `main` (or configured branch). SPA routing uses `vercel.json` with rewrites.

**Backend (Heroku)**:

- Preferred: GitHub integration (push -> auto build & release)
- Legacy: `git push heroku main`

Ensure environment variables are configured in the Heroku dashboard before deploying.

---

## Security & Secrets

- Never commit `.env` or real credentials.
- Use strong JWT secrets (>= 32 chars).
- CORS: Keep `CORS_ORIGIN` restricted to known frontends in production.
- Validate file uploads (MIME/type) before processing.
- Sanitize or constrain regex searches to avoid ReDoS.

---

## Issue Reporting

When opening an issue, include:

- **Type**: bug | feature | enhancement | question
- **Environment**: browser/version, node version
- **Reproduction Steps**
- **Expected vs Actual**
- **Logs / Screenshots** (if applicable)

Template (example):

```
### Summary
Order detail page crashes on null payment.

### Steps
1. Create order without payment method
2. Open /admin/dashboard/orders

### Expected
Row renders with placeholder method

### Actual
TypeError: cannot read property 'toLowerCase'
```

---

## Pull Request Checklist

Before marking a PR ready for review:

- [ ] Branch named with `feat/`, `fix/`, etc.
- [ ] Lint passes (`eslint` shows no new errors/warnings) _(if configured)_
- [ ] No unrelated file churn / formatting noise
- [ ] API responses follow existing `ApiResponse` pattern
- [ ] Added RBAC gate where appropriate (both backend & frontend)
- [ ] Updated Postman request (if endpoint changed/added)
- [ ] Updated README / docs if behavior or setup changed
- [ ] Manual smoke test: login, animals list, create/edit (if affected)

---

## Release & Versioning

Currently unversioned (development stage). Once stable:

- Adopt semantic versioning (e.g., v1.0.0) at first deploy milestone.
- Tag releases: `git tag v1.0.0 && git push --tags`
- Changelog derived from Conventional Commit messages.

---

## FAQ

**Q: Why am I seeing 401/404 in console on public pages?**  
A: Auth check now only runs for `/admin` routes to avoid noise.

**Q: How do I add new roles?**  
A: Update roles array in `adminUser.model`, adjust `PERMISSIONS` in `useAdminsStore`, and extend RBAC middleware logic if needed.

**Q: How can I contribute payments integration?**  
A: Add provider service module (e.g., `services/payments/razorpay.js`), webhook route, update order controller to transition status on success.

**Q: Image upload fails with MulterError: Unexpected field?**  
A: Ensure the frontend form uses field name `image` (matching `upload.single("image")`).

---

Thanks for contributing! 💚 If you have questions, open an issue or start a discussion.
