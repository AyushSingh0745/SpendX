# SpendX — Smart Financial Intelligence & Expense Tracker

<div align="center">

![SpendX Banner](public/icon-512.png)

**Cinematic, data-forward personal finance & cashflow intelligence tailored for the Indian Rupee (₹).**  
Inspired by Copilot Money and Apple's clean design philosophy — built without AI slop, neon purple clutter, or clunky bento grids.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-blue?style=flat)](https://turbo.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![Agnes AI](https://img.shields.io/badge/Agnes%203.0-Gemini%20Flash-4285F4?style=flat)](https://ai.google.dev/)
[![PWA](https://img.shields.io/badge/PWA-Installable-purple?style=flat)](https://spendx-gamma.vercel.app/)

[Live Demo](https://spendx-gamma.vercel.app) • [Architecture](#architecture) • [Database Schema](#database-schema) • [Quickstart](#quickstart) • [Security & Auth](#security--authentication)

</div>

---

## Overview

Traditional expense trackers are either tedious manual spreadsheets or cluttered, generic mobile apps. **SpendX** combines clean typographic hierarchy, fluid Lenis smooth-scrolling, an interactive 3D hero visualization, and the **Agnes 3.0 Flash AI Advisor** to deliver actionable financial clarity:

- **True Cashflow Clarity:** Real-time calculation of Inflow (Income), Outflow (Expenses), Net Surplus, and Savings Rate in Indian Rupees (`₹`).
- **Spendee-style Recommended Daily Allowance:** Dynamically adjusts your safe daily spending velocity based on your liquid balance and the exact remaining days in the calendar month.
- **Natural Language Spend Logging:** Type or talk to Agnes (*"Spent ₹350 on lunch at Subway"* or *"Got ₹15,000 freelance bonus"*) — the AI parses the category, date, and amount, records the transaction in your database, and gives contextual feedback.
- **Category Allocation Donut:** Interactive SVG visualization showing expenditure concentration across 10 curated categories.
- **Budget Threshold Tracking:** Visual progress bars with alert triggers when spending exceeds 85% or 100% of category allocations.
- **Cross-Platform PWA:** Full Progressive Web App capability with offline asset caching and seamless installation on Android, iOS Safari, and Desktop.

---

## Architecture

```
                       ┌─────────────────────────────────────────┐
                       │            Client Devices               │
                       │    Desktop Web • iOS PWA • Android PWA  │
                       └────────────────────┬────────────────────┘
                                            │
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │           Next.js 16 Edge / App         │
                       │  - Middleware (Session JWT validation)   │
                       │  - Lenis Smooth Scroll Engine           │
                       │  - Three.js WebGL Financial Prism       │
                       └────────────────────┬────────────────────┘
                                            │
             ┌──────────────────────────────┴──────────────────────────────┐
             ▼                                                             ▼
┌─────────────────────────┐                                   ┌─────────────────────────┐
│     Next.js API Routes  │                                   │  Agnes 3.0 Flash Engine │
│ - /api/summary          │                                   │ - Live Ledger Context   │
│ - /api/expenses         │ ◄────── Natural Language Chat ────┤ - Schema-guided Action  │
│ - /api/income           │                                   │ - Financial Forecasting │
│ - /api/budgets          │                                   └─────────────────────────┘
│ - /api/auth/*           │
└────────────┬────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────┐
│               Data Persistence Layer                   │
│  Primary: Supabase Cloud PostgreSQL (RLS / Pooling)   │
│  Fallback: Atomic Local JSON Store (Offline / Local)   │
└────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, Partial Prerendering) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **Motion & 3D** | Three.js (WebGL rendering), Lenis Smooth Scroll, Canvas Confetti |
| **Database** | PostgreSQL on Supabase + Atomic Local JSON Fallback |
| **Authentication** | Custom Database Auth (Bcrypt salted password hashing, 6-digit OTP, JWT HTTP-only Cookies) |
| **AI Engine** | Agnes 3.0 Flash (Google Gemini 2.5 Interactions API via OpenRouter) |
| **Deployment** | Vercel Serverless Edge Network |

---

## Security & Authentication

SpendX avoids vendor lock-in by implementing an independent, auditable custom database authentication architecture:

1. **Bcrypt Salted Hashes:** User passwords are encrypted with adaptive work-factor salts before storage in PostgreSQL (`users.password_hash`).
2. **HTTP-Only Session Cookies:** Sessions are minted as signed JSON Web Tokens (`spendx_session`) stored in `SameSite=Lax`, `Secure`, `HttpOnly` cookies — immune to XSS token theft.
3. **Edge Route Protection:** A Next.js middleware intercepts unauthenticated requests to `/dashboard`, `/transactions`, `/analytics`, `/budgets`, `/ai-advisor`, and `/profile`, redirecting unauthorized visitors immediately to `/login`.
4. **Self-Service Credentials & OTP Reset:**
   - In-app **Change Password** flow verifying existing passwords against database hashes.
   - 6-digit **OTP Recovery Flow** for forgotten credentials.
   - Passwordless **One-Time Password (OTP)** sign-in support.

---

## Database Schema

Run this SQL migration in your Supabase SQL Editor:

```sql
-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Income Records
CREATE TABLE IF NOT EXISTS public.income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Expense Records
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Budgets
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  monthly_limit NUMERIC(12, 2) NOT NULL,
  month TEXT NOT NULL, -- e.g. '2026-11'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, category, month)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_income_user_date ON public.income(user_id, date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON public.budgets(user_id, month);
```

---

## Quickstart

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/AyushSingh0745/SpendX.git
cd SpendX
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory:

```env
# Supabase Database Connection
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# JWT Authentication Secret
JWT_SECRET=your-secure-random-jwt-secret-string

# AI Advisory Engine (Agnes 3.0 / OpenRouter)
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=google/gemini-2.5-flash
```

*(Note: If Supabase credentials are not provided, SpendX will gracefully fall back to its internal atomic local storage located at `data/financials.json`)*.

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

- `npm run dev` — Launch Next.js development server with Turbopack.
- `npm run build` — Compile production-optimized static & dynamic bundles.
- `npm start` — Run production server.
- `node .agents/skills/kill-ai-slop/scripts/scan.mjs src` — Audit codebase against AI visual slop patterns.

---

## License
MIT License. Crafted with precision by Ayush Singh.
