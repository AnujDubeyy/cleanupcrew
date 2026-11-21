# CleanupCrew

CleanupCrew is a platform for organising and joining community cleanup drives: browse drives, view them on a map, report littered spots, track a leaderboard, and earn certificates for participation. It has a React frontend and a separate TypeScript/Express API backed by MongoDB.

## Features

- Cleanup drive listings and drive details, with a map view (Leaflet)
- Report-a-spot flow for flagging locations that need cleaning
- Leaderboard and transparency pages
- Accounts with email verification, user dashboard, and an admin panel
- Certificates per drive (PDF generation on the API)
- Stripe integration on both frontend and API for payments

## Tech stack

- Frontend: React 19, Vite, React Router 7, Tailwind CSS v4, Framer Motion, Leaflet/`react-leaflet`, Stripe.js, Spline
- API (`server/`): TypeScript, Express 5, Mongoose/MongoDB, JWT auth, bcrypt, Zod validation, Helmet/rate limiting, Nodemailer, PDFKit, Stripe
- API tests: Jest + Supertest

## Getting started

Prerequisites: Node.js and npm, plus a MongoDB database for the API.

```bash
git clone https://github.com/AnujDubeyy/cleanupcrew.git
cd cleanupcrew
npm install
cd server && npm install && cd ..
```

Configure the API from environment variables (the server uses `dotenv`). Check `server/src` for the variables it reads — database connection, auth, payments and email settings — and set them in `server/.env`. Never commit a real `.env` file.

Run the frontend and API together from the repo root:

```bash
npm run dev:full
```

Or run them separately:

```bash
npm run dev        # frontend (Vite)
npm run dev:api    # API via nodemon in server/
```

| Command | Purpose |
| --- | --- |
| `npm run dev` / `npm run build` / `npm run preview` | Frontend dev server / production build / preview |
| `npm run build:api` | Typecheck and build the API (`server/`) |
| `npm run lint` | Lint the frontend |

API commands (run inside `server/`): `npm run dev`, `npm run build`, `npm start` (runs `dist/server.js`), `npm test`.

## Project structure

```
cleanupcrew/
├── index.html
├── src/                     # React frontend: pages (Landing, Drives, MapPage, Leaderboard,
│                            # Transparency, Login/Register, Dashboard, AdminPanel, ReportSpot,
│                            # Certificate), components, context, hooks, data, lib
├── server/                  # TypeScript Express API (@cleanupcrew/api)
│   ├── src/                 # API source
│   ├── seed.cjs             # Seed data
│   └── promote-admin.js     # Admin promotion helper
├── fix-ui.js polish.js refactor*.js swap-avatars.js   # One-off UI/refactor helper scripts
└── package.json
```
