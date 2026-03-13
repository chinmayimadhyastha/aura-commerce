# Aurèle Commerce — MERN Stack

Full MERN stack conversion of the original Supabase/Vite project.
All UI is identical. Supabase replaced with:

- **MongoDB** — database (was Supabase Postgres)
- **Express + Node.js** — REST API (was Supabase auto-generated)
- **JWT** — authentication (was Supabase Auth)
- **Socket.io** — real-time events (was Supabase Realtime)

## Project Structure

```
mern/
├── server/         # Express + Node.js + MongoDB backend
│   ├── src/
│   │   ├── index.js
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # Express routes
│   │   └── middleware/   # JWT auth middleware
│   └── package.json
│
└── client/         # React + Vite + Tailwind frontend
    ├── src/
    │   ├── integrations/api/client.ts  # Axios (replaces Supabase client)
    │   ├── contexts/AuthContext.tsx    # JWT auth context
    │   ├── pages/
    │   ├── components/
    │   └── ...
    └── package.json
```

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 1. Server

```bash
cd server
npm install
# Edit .env: set MONGODB_URI and JWT_SECRET
npm run dev
```

Server runs on `http://localhost:5000`.
Products are seeded automatically on first run.

### 2. Client

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`.

### Environment Variables

**server/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aura-commerce
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## API Endpoints

### Auth
- `POST /api/auth/signup` — Register
- `POST /api/auth/signin` — Login → returns JWT
- `GET  /api/auth/me` — Current user (auth required)
- `POST /api/auth/update-password` — Update password (auth required)
- `POST /api/auth/reset-password` — Request reset (hook up email in production)

### Products
- `GET /api/products` — All products
- `GET /api/products/:id` — Single product

### Shopping Sessions (real-time via Socket.io)
- `POST /api/sessions` — Create session
- `POST /api/sessions/join` — Join by invite code
- `GET  /api/sessions/:id` — Get session
- `POST /api/sessions/:id/cart` — Add to cart
- `DELETE /api/sessions/:id/cart/:itemId` — Remove from cart
- `POST /api/sessions/:id/messages` — Send message
- `POST /api/sessions/:id/votes` — Vote on product

### Group Deals (real-time via Socket.io)
- `GET  /api/group-deals` — All active deals
- `POST /api/group-deals` — Create deal
- `POST /api/group-deals/:id/join` — Join deal
- `POST /api/group-deals/join-by-code` — Join by invite code

## Changes from Original

| Original (Supabase) | MERN Replacement |
|---|---|
| `supabase.auth.signInWithPassword` | `POST /api/auth/signin` → JWT |
| `supabase.auth.signUp` | `POST /api/auth/signup` → JWT |
| `supabase.from("products").select()` | `GET /api/products` |
| `supabase.channel(...).subscribe()` | `socket.on(...)` via Socket.io |
| Supabase RLS policies | Express middleware + ownership checks |
| `@supabase/supabase-js` | `axios` + `socket.io-client` |
| OAuth (Google/Apple via Lovable) | Removed (add Passport.js to restore) |
| Supabase migrations (SQL) | Mongoose models + auto-seeding |
