# Romeo & Juliet — Admin Portal (Full-stack Next.js)

This project now runs as a full-stack Next.js app using the App Router.

## Run locally
Requirements: Node.js 18.18+

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build and run production

```bash
npm run build
npm start
```

## API routes
- `GET /api/health` - health check
- `GET /api/bootstrap` - initial members and referrals payload
- `POST /api/auth/login` - demo auth endpoint

## Demo Credentials
| Role        | Email                          | Password  |
|-------------|-------------------------------|-----------|
| Super Admin | admin@romeoandjuliet.app       | admin123  |
| Moderator   | mod@romeoandjuliet.app         | admin123  |

## Features
- Dashboard with live charts (member growth, phase breakdown)
- Analytics — match funnel, daily accept/reject charts
- Members — search, filter, member detail modal
- Approvals — one-click approve/reject with state feedback
- Referrals — full CRUD, copy codes, toggle active/pause
- Matches — grid + table view, compat breakdown, expiry alerts
- Juliet Chats — live session tracking with progress bars
- Romeo Engine — dimension weights, service health
- System Health — service uptime, API traffic charts
- Security — checklist, audit log (Super Admin only)
- Settings — live sliders and toggles with save/discard

## Tech
Built with Next.js (App Router) + React 19 + TypeScript.
Includes client UI plus server API routes in one codebase.
# rjadmin
