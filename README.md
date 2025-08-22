# ZMS — Zoo Management System (Zoo Verse)

ZMS is a full‑stack web app for managing a zoo website (Zoo Verse). It includes a public frontend (animals, tickets, contact) and an admin backend (animals CRUD, orders, messages, admin auth).

## Tech Stack

- Frontend: React, React Router, Tailwind CSS (styles), Vite (dev/build)
- Backend: Node.js, Express, MongoDB (Mongoose), JWT (admin auth), Multer (uploads), Cloudinary (optional image hosting)

## Monorepo Structure

- frontend/ — React SPA, served statically in production with an Express server (server.js)
- backend/ — REST API (Express + Mongoose), secured admin endpoints

## Features

- Public
  - Animals listing and detail
  - Contact form (sends message to backend)
  - Ticket flow (orders)
- Admin
  - Admin authentication (JWT access/refresh tokens)
  - Animals CRUD with optional image upload (Multer + Cloudinary)
  - Orders listing, summary “table” view
  - Messages inbox: list, read, archive, assign handler
- Utilities
  - Scroll-to-top behavior
  - Footer and static pages (Privacy, Terms)

## Backend

- Models
  - AdminUser: name, email, role, passwordHash, status, refreshToken (+ hashing and JWT helpers)
  - Animal: name (unique, lowercase), title, category, description, imageUrl
  - Order: customer (optional ref) or contact snapshot, items (ticketType, qty, price), totals, status, paymentMethod
  - Message: name, email, subject, body, status, handledBy
- Key Endpoints (prefix as configured, e.g., /api)
  - Admin: POST /api/admin/register, POST /api/admin/login, POST /api/admin/logout, POST /api/admin/refresh-token, GET /api/admin/current-user, POST /api/admin/change-password, PATCH /api/admin/update-account
  - Animals: GET /api/animals, GET /api/animals/:id, POST /api/animals, PATCH /api/animals/:id, DELETE /api/animals/:id
  - Orders: POST /api/orders, GET /api/orders, GET /api/orders/table, GET /api/orders/:id, PATCH /api/orders/:id, PATCH /api/orders/:id/status, DELETE /api/orders/:id
  - Messages: POST /api/messages (public), GET /api/messages, GET /api/messages/:id, PATCH /api/messages/:id, POST /api/messages/:id/read, POST /api/messages/:id/archive, DELETE /api/messages/:id
- Auth
  - Admin-only JWT middleware: verifyJWT
  - Uses httpOnly cookies or Bearer token

### Backend Setup

1. Environment

- Create backend/.env
  - MONGODB_URI=mongodb+srv://user:pass@host/
  - MONGODB_DB=zms (optional if DB in URI)
  - ACCESS_TOKEN_SECRET=your-access-secret
  - REFRESH_TOKEN_SECRET=your-refresh-secret
  - ACCESS_TOKEN_EXPIRY=15m
  - REFRESH_TOKEN_EXPIRY=7d
  - CLOUDINARY_CLOUD_NAME=...
  - CLOUDINARY_API_KEY=...
  - CLOUDINARY_API_SECRET=...

2. Install and run

- Windows PowerShell:
  - cd backend
  - npm install
  - npm run dev (or npm start)

3. Postman tips

- For multipart/form-data with text only: use upload.none() routes (messages)
- For image upload (animals): send key image (type File) and text fields (name, description, ...)

## Frontend

- React SPA under frontend/src
- Client routes (examples): /, /animals, /animals/:slug, /tickets, /contact, /privacy, /terms, /admin/...
- Uses an Express server (server.js) to serve the built app with SPA fallback

### Frontend Setup

1. Install and run

- cd frontend
- npm install
- npm run dev (Vite dev server)

2. Build

- npm run build
- npm start (runs Express server.js to serve the built assets)

3. Scroll-to-Top

- components/ScrollToTop is mounted inside Router to reset scroll on navigation


## Scripts (typical)

- Backend
  - npm run dev — start API in watch mode
  - npm start — start API
- Frontend
  - npm run dev — Vite dev server
  - npm run build — production build
  - npm start — serve build via Express

## Notes

- Ensure unique index on Animal.name before inserting duplicates
- For “Unexpected field” Multer errors, match Postman keys to route upload.single("image")
- For JWT issues, confirm ACCESS_TOKEN_SECRET and cookie settings in requests (httpOnly, secure)