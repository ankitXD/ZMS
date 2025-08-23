# ZMS — Zoo Management System (Zoo Verse)

ZMS is a full‑stack web app for a zoo website. It includes a public frontend (animals, tickets, contact) and an admin backend (animals CRUD, orders with QR tickets, messages inbox, admin auth with RBAC).

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Vite
- Backend: Node.js, Express, MongoDB (Mongoose), JWT (admin auth), Multer (uploads), Cloudinary (optional), QRCode, Razorpay (optional)
- Deployment: Any Node host (Express serves API; frontend can be served by a static server with SPA fallback)

## Monorepo Structure

- frontend/ — React SPA (Vite). In production build, JS is bundled/minified.
- backend/ — REST API (Express + Mongoose), secured admin endpoints, webhooks.

## Features

- Public
  - Animals listing and detail
  - Contact form (submits a Message)
  - Ticket purchase flow
    - Create Order (public, status=pending)
    - Payment: cash (demo) or Razorpay (optional)
    - QR code tickets issued on payment success
    - Public verify endpoint to scan/validate tickets
- Admin
  - Admin authentication (JWT access/refresh)
  - Role-based access control: owner, admin, editor
  - Animals CRUD with optional image upload (Multer + Cloudinary)
  - Orders: list, table view (Status, Order ID, Customer, Email, Tickets, Total, Payment Method, PlacedTime), update status to paid (generates QR), verify ticket
  - Messages inbox: list, detail, update (status/assignee), mark read, archive, delete

## Backend

### Models

- AdminUser: name, email, role, passwordHash, status, refreshToken
- Animal: name (unique, lowercase), title, category, description, imageUrl
- Order:
  - contact: { name, email, phone }
  - items: [{ ticketType, quantity, unitPrice, subtotal }]
  - tickets: [{ code, tokenHash, ticketType, status, issuedAt, usedAt }]
  - totalAmount, currency, status: pending|paid|refunded|cancelled, paymentMethod
- Message: name, email, subject, body, status: new|read|archived, handledBy

### Key Endpoints (prefix /api)

- Admin: /admin/... (register, login, logout, refresh, current-user, change-password, update-account)
- Animals:
  - GET /animals, GET /animals/:id
  - POST /animals, PATCH /animals/:id, DELETE /animals/:id (JWT + RBAC)
- Messages:
  - POST /messages (public, JSON)
  - GET /messages, GET /messages/:id, PATCH /messages/:id, POST /messages/:id/read, POST /messages/:id/archive, DELETE /messages/:id (JWT + RBAC)
- Orders:
  - POST /orders (public create; status forced to pending)
  - GET /orders, GET /orders/table, GET /orders/:id (JWT + RBAC)
  - PATCH /orders/:id, PATCH /orders/:id/status (JWT + RBAC; paid => generate QR)
  - GET /orders/verify?code=... (public verify/scan)
- Payments (optional):
  - POST /payments/intent { orderId, provider: "cash"|"razorpay" } (public)
    - cash: marks order paid and issues tickets immediately
    - razorpay: returns Razorpay order; QR issued via webhook
  - POST /payments/razorpay/webhook (raw body; signature verified)
  - PATCH /payments/:id/simulate-success (JWT; dev helper)

### Auth & RBAC

- verifyJWT attaches req.user with role
- requireAdminRole("owner" | "admin" | "editor") wraps protected routes
  - Typical policy:
    - Animals: create/update (admin, editor), delete (admin, owner)
    - Messages: list/read/update/archive (admin, editor), delete (admin, owner)
    - Orders: list/get/update/status/table (admin, owner), delete (owner)

### Backend Setup

1. Environment (backend/.env)

- MONGODB_URI=mongodb+srv://user:pass@host/
- MONGODB_DB=zms
- ACCESS_TOKEN_SECRET=your-access-secret
- REFRESH_TOKEN_SECRET=your-refresh-secret
- ACCESS_TOKEN_EXPIRY=15m
- REFRESH_TOKEN_EXPIRY=7d
- CLOUDINARY_CLOUD_NAME=...
- CLOUDINARY_API_KEY=...
- CLOUDINARY_API_SECRET=...
- CORS_ORIGIN=http://localhost:5173

2. Install and run (Windows PowerShell)

- cd backend
- npm install
- npm run dev

3. Middleware

- cors, cookie-parser, express.json/urlencoded
- Multer on image routes only (animals)
- Razorpay webhook route uses express.raw({ type: "application/json" })
- Central error handler

### Postman Quick Start

- Animals:
  - GET /api/animals
  - GET /api/animals/:id
- Message (public):
  - POST /api/messages (JSON) { name, email, subject?, body }
- Order (public):
  - POST /api/orders (JSON) { contact: { name, email, phone }, items: [{ ticketType, quantity, unitPrice }], paymentMethod? }
  - Result: order created with status=pending
- Payment and tickets:
  - Demo cash: POST /api/payments/intent { orderId, provider: "cash" } => returns { order: paid, qrCodes[] }
  - Or admin: PATCH /api/orders/:id/status { "status": "paid" } (Bearer token) => returns qrCodes[]
  - Verify at gate: GET /api/orders/verify?code=THE_CODE

## Frontend

- Pages: Home, Animals (/animals), Animal Detail (/animals/:id), Tickets, Contact, Admin screens (optional)
- Contact uses Zustand store (useMessageStore) to POST /api/messages (JSON)
- Animals pages use Zustand store (useAnimalStore) to fetch list/detail

### Frontend Setup

- cd frontend
- npm install
- npm run dev

### Production Build (hide source modules)

- npm run build
- npm start (Express server.js serving dist with SPA fallback)
- Vite config ensures no source maps and hashed filenames

Example vite.config.js:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
```

## Scripts

- Backend: npm run dev, npm start
- Frontend: npm run dev, npm run build, npm start

## Notes

- Animal.name is unique (lowercase). Ensure index built and no duplicates before enabling unique.
- Multer “Unexpected field” => match the field name image in Postman and route upload.single("image").
- Place GET /api/orders/verify before /api/orders/:id route to avoid matching :id.
- Secure production admin registration: disable public register or restrict to
