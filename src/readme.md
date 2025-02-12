# BabyGPT

## Prerequisites
- Node.js (v16+)
- Netlify CLI
- Stripe Account
- Supabase Account

## Local Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local` to `.env` and fill in your credentials
4. Run local development: `netlify dev`

## Environment Variables
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

## Deployment
Deploy to Netlify and set environment variables in Netlify Dashboard