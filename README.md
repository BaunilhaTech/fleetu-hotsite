# Fleetu — Where Intent Becomes System

> **"Software organizations don't fail because they lack tools. They fail because decisions don't scale."**

Fleetu is an engineering governance platform that turns organizational decisions into executable systems. Instead of relying on PDFs, wiki pages, and manual enforcement, Fleetu allows companies to define policies as code and automatically propagate them across hundreds of repositories.

This repository contains the **high-performance landing page** (hotsite) designed to communicate this value proposition to engineering leaders.

## 🎯 The Problem

As organizations grow, systems drift away from intent:
- Policies become static documents.
- Standards become mere suggestions.
- Migrations turn into endless, unmanageable projects.

## 💡 The Solution

Fleetu closes this gap by making governance **automated**, **auditable**, and **scalable**. With Fleetu, intent becomes system, and systems stay aligned.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
- **Backend/DB:** [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

## ✨ Key Features

- **Performance First:** 
  - Optimized animations using `requestAnimationFrame` with direct DOM manipulation (zero React render overhead).
  - `IntersectionObserver` implementations to pause off-screen animations.
  - Efficient component updates with throttled intervals.
- **Global & Accessible:**
  - Full i18n support for English (`en`) and Brazilian Portuguese (`pt-BR`).
  - Dynamic `lang` attributes and localized metadata.
  - Respects System `prefers-reduced-motion` settings.
  - ARIA-compliant navigation, grids, and forms.
- **SEO Optimized:**
  - Automated `sitemap.xml` and `robots.txt` generation.
  - Semantic HTML structure.
  - Open Graph and Twitter Card metadata for social sharing.
  - `hreflang` attributes for proper regional targeting.
- **Secure:**
  - Supabase Row Level Security (RLS) ensures data integrity.
  - Anonymous users are restricted to `INSERT` only.
  - Honeypot fields and submission cooldowns to prevent bot spam.

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BaunilhaTech/fleetu-hotsite.git
   cd fleetu-hotsite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🗄️ Database Schema

The project uses Supabase (PostgreSQL) for lead capture.

- **Table:** `leads`
  - `id` (uuid, pk)
  - `email` (text, unique)
  - `role` (text)
  - `fleet_size` (text)
  - `created_at` (timestamptz)

### Security (RLS)
- **Anonymous Users:** Can `INSERT` only. No read/update/delete access.
- **Admins:** Read access restricted to specific GitHub users defined in RLS policies.
- **Schema:** Full migration available at `supabase/migrations/20260210_initial_schema.sql`.

## � Admin Panel

The site includes a restricted area at `/admin` for viewing captured leads.
- **Authentication:** GitHub OAuth via Supabase.
- **Authorization:** Allowlist enforced via RLS policies and client-side checks.
- **Access:** Only specific GitHub usernames (e.g., maintainers) are permitted to view data.

## �📦 Deployment

This project is configured for static export but uses Next.js Image Optimization and dynamic routing (`[locale]`).

- **Build Command:** `npm run build`
- **Output:** `out/` (Static Export)

Deployment workflows are configured for **GitHub Pages**.

## 📄 License

Copyright © 2026 Fleetu. All rights reserved.
