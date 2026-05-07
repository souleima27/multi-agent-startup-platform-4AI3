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

## Free Render deployment

Deploy the frontend as a Render Static Site:

- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Rewrite Rule: `/*` to `/index.html`

The same configuration is included in `render.yaml`, so you can also create the site from Render Blueprints.

Set these environment variables in Render if the corresponding services are deployed:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_TRACK1_API_URL`
- `VITE_TRACK2_API_URL`
- `VITE_TRACK3_EXECUTION_API_URL`
- `VITE_PITCH_COACH_API_URL`

If the Python APIs are not deployed yet, the landing page still builds, but agent pages that call those APIs will not work online.

## Notes

- The current search panel is a local smart search UI. It is a clean place to later wire in semantic search or Milvus-backed retrieval.
- Testimonials are only publicly fetched when `approved = true`.
