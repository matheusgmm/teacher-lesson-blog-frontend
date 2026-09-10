# Teacher Lesson Blog

[![CI](https://github.com/matheusgmm/teacher-lesson-blog-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/matheusgmm/teacher-lesson-blog-frontend/actions/workflows/ci.yml)
[![Docker](https://github.com/matheusgmm/teacher-lesson-blog-frontend/actions/workflows/docker.yml/badge.svg)](https://github.com/matheusgmm/teacher-lesson-blog-frontend/actions/workflows/docker.yml)

React frontend for a teacher lesson-sharing blog platform built to support public education at scale.

Stack: **React 19**, **TypeScript**, **Vite 8**, **React Router 7**, **SCSS**, **Context API**, **GitHub Actions**.

API: [teacher-lesson-blog](https://github.com/matheusgmm/teacher-lesson-blog).

---

## Table of contents

- [Teacher Lesson Blog](#teacher-lesson-blog)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Quick start](#quick-start)
  - [Environment variables](#environment-variables)
  - [Running the app](#running-the-app)
  - [Roles](#roles)
  - [Seeded accounts](#seeded-accounts)
  - [Application state](#application-state)
  - [Docker](#docker)
    - [Local build](#local-build)
    - [Compose (nginx on port 8080)](#compose-nginx-on-port-8080)
  - [CI/CD (GitHub Actions)](#cicd-github-actions)
    - [Workflows](#workflows)
  - [License](#license)

---

## Features

- Auth: login, public register (`USER`), JWT session, remember me
- Light / dark theme persisted in `localStorage`
- Lesson posts: search, date range, pagination (10 per page)
- Post detail with comments
- Admin: create posts, edit own posts, soft-delete any post
- Comments: any authenticated user can read and create; author edits; author or admin soft-deletes
- Community (admin): list, create, detail, update, soft-delete
- Password change from the sidebar profile
- Protected routes by authentication and role

---

## Requirements

- **Node.js** `>= 22.12` (see `.nvmrc` → `22`)
- **npm**
- The [teacher-lesson-blog](https://github.com/matheusgmm/teacher-lesson-blog) API running (default port `3000`)
- **Docker** + Docker Compose (optional, for the production image)

```bash
nvm use   # if you use nvm
node -v   # should be v22.x
```

---

## Quick start

Start the **API** first (from that repository):

```bash
cp .env.example .env
docker compose up db -d
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Then this **frontend**:

```bash
# 1) Install dependencies
npm install

# 2) Create your env file
cp .env.example .env

# 3) Start Vite
npm run dev
```

App: `http://localhost:5173`  
API: `http://localhost:3000`  
Swagger: `http://localhost:3000/api/docs`

Vite proxies `/api` to `http://localhost:3000`. `.env.example` also sets `VITE_API_URL` to that same URL.

---

## Environment variables

Copy `.env.example` to `.env`. Only variables prefixed with `VITE_` are exposed to the browser.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | **yes** | API base URL, no trailing slash (local default `http://localhost:3000`) |

Vite inlines `VITE_API_URL` at **build** time. For Docker, pass it as a build arg (see [Docker](#docker)).

Allow the frontend origin in the API `CORS_ORIGIN` (`http://localhost:5173` in dev, `http://localhost:8080` for the nginx image). The API `.env.example` already includes both.

---

## Running the app

```bash
npm run dev         # development (Vite, port 5173)
npm run build       # typecheck + production bundle → dist/
npm run preview     # serve dist/ locally
npm run typecheck
npm run lint
npm run lint:fix
```

---

## Roles

| Route | Access | Purpose |
|-------|--------|---------|
| `/login`, `/register` | guest | authentication |
| `/` | admin | dashboard |
| `/posts` | authenticated | lesson list |
| `/posts/new` | admin | create lesson |
| `/posts/:id` | authenticated | lesson + comments |
| `/posts/:id/edit` | admin (author) | edit lesson |
| `/users`, `/users/new`, `/users/:id` | admin | community |

- **USER** — read posts, comment, edit/delete own comments, update own profile.
- **ADMIN** — post CRUD (edit own posts only), community management, delete any comment.

Authenticated routes use `ProtectedRoute`. Admin routes use `RoleRoute`.

---

## Seeded accounts

Created by `npm run db:seed` on the API:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@teacherlesson.local` | `Admin@123` |
| Member | `ana.souza@teacherlesson.local` | `Aluno@123` |

Other demo members use `*@teacherlesson.local` with password `Aluno@123`.

---

## Application state

Shared state uses the React **Context API**:

| Provider | Holds |
|----------|--------|
| `AuthProvider` | user, token, login, logout, session updates |
| `ThemeProvider` | light / dark theme |
| `SidebarProvider` | sidebar open / closed |

Page-level data (filters, pagination, forms, comment lists) stays in local state or feature hooks (`usePosts`, `useComments`, `useSearchParams`).

---

## Docker

Multi-stage image: Node 22 builds `dist/`; nginx 1.27 serves the SPA (`try_files` → `index.html`).

### Local build

```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:3000 \
  -t teacher-lesson-blog-frontend:local .
```

### Compose (nginx on port 8080)

With the API already running at `http://localhost:3000`:

```bash
docker compose up --build
```

App: `http://localhost:8080`

The browser calls `VITE_API_URL` (default `http://localhost:3000`). The API `CORS_ORIGIN` must include `http://localhost:8080`.

To point at another API host:

```bash
VITE_API_URL=https://api.example.com docker compose up --build
```

Rebuild is required after changing `VITE_API_URL`.

---

## CI/CD (GitHub Actions)

This repository automates **CI** (quality checks) and a lightweight delivery check (Docker image build).  
Public cloud deploy is intentionally **not** configured yet.

### Workflows

| Workflow | File | When it runs | What it does |
|----------|------|--------------|--------------|
| **CI** | `.github/workflows/ci.yml` | `push` / `pull_request` → `main` | `npm ci` → lint → typecheck → `npm run build` |
| **Docker** | `.github/workflows/docker.yml` | `push` / `pull_request` → `main` | Build the production Docker image (`push: false`) |

CI does **not** use GitHub Secrets. `VITE_API_URL` is set in the workflow file.

---

## License

Apache License 2.0. See [LICENSE](./LICENSE).
