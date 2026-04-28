# Venture Path

Modern startup landing page with React + Vite and a Supabase-ready data layer.

## Features

- Responsive SaaS-style landing page
- Contact form storage
- Newsletter subscriber storage
- Pricing plan selection capture
- Signup and login with Supabase Auth
- Testimonials retrieval and review submission
- Dark mode, animated counters, FAQ accordion, micro-interactions
- Demo-safe local fallback when Supabase keys are not configured

## Setup

1. Copy `.env.example` to `.env`
2. Add your Supabase project URL and anon key
3. Run the SQL in `supabase/schema.sql`
4. Install dependencies with `npm install`
5. Start the app with `npm run dev`

## Notes

- The current search panel is a local smart search UI. It is a clean place to later wire in semantic search or Milvus-backed retrieval.
- Testimonials are only publicly fetched when `approved = true`.
