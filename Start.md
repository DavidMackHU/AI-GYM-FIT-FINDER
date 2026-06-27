# CLAUDE_START_HERE.md — Fenix Fit Finder

## Session Start Instructions

Before doing anything else:
1. Read every existing file in this project to understand what has been built
2. Read this entire document top to bottom
3. Report back:
   - What has been completed so far
   - Which Build Order step we are on
   - What you recommend building next
4. Wait for my confirmation before writing a single line of code

---

## Progress Tracker

| Step | Feature | Status | Notes |
|------|---------|--------|-------|
| 1 | Project setup (React + TS + Vite, Tailwind CSS) | ✅ | Vite + React 18 + TS + Tailwind v4 + React Router v6 + Anthropic SDK |
| 2 | Product catalog (load from products.json) | ✅ | 46 products across 4 categories; placeholder affiliate URLs |
| 3 | Quiz UI (5-question flow) | ✅ | Step-by-step with progress bar, orange selected state |
| 4 | Claude AI recommendation engine (Anthropic API) | ✅ | claude-sonnet-4-6, dangerouslyAllowBrowser, JSON parse |
| 5 | Outfit results page (4 items + affiliate links) | ✅ | 2×2 grid, loading screen, error state, affiliate disclosure |
| 6 | Responsive mobile design | ✅ | Mobile-first Tailwind, sm: breakpoints, min 52px tap targets |
| 7 | Fenix brand polish (colors, fonts, logo) | ✅ | #0D0D0D bg, #FF6B00 orange, Inter font, dark cards |
| 8 | Vercel deployment + wearfenix.com domain | ⬜ | |

---

## Rules Claude Must Follow

- Never skip steps
- Always ask before starting next step
- Update progress tracker after each step
- Never delete working code without telling me first
- If blocked, stop and explain before trying a workaround
- Files max 300 lines — split into components if longer
- Always use TypeScript
- Run app after each step to confirm it works
- "status" = show me the progress table
- "stop" = halt immediately, do nothing else

### Before Making Any Edit:
1. Tell me which file you are about to change
2. Tell me what you are changing and why
3. Wait for my confirmation

---

## Edit & Undo Commands

- `undo` — revert last change
- `undo last [n]` — revert last N changes
- `revert [filename]` — restore specific file
- `show diff` — show what changed before applying
- `preview before changing` — ask permission first
- `checkpoint` — git commit current state
- `restore checkpoint` — git checkout to last save
- `what did you change` — list all modified files
- `fix only [filename]` — only edit specified file

---

## Tech Stack

- **Frontend:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **AI:** Anthropic Claude API (claude-sonnet-4-6) — user brings their own key
- **Product catalog:** Local `products.json` file (30–50 curated items)
- **Deployment:** Vercel (free tier)
- **Domain:** wearfenix.com (already owned, connect in Vercel dashboard)
- **Monetization:** Amazon Associates affiliate links embedded in product data
- **Total hosting cost: $0**

> No backend, no database, no auth needed for MVP. Pure frontend + AI API call.

---

## PRD — Fenix Fit Finder

### Overview
Fenix Fit Finder is an AI-powered gym outfit recommender at wearfenix.com. Users answer 5 quick questions, and Claude AI picks the best matching top, bottom, shoes, and accessory from a curated product catalog — displaying each with a product name, price, short reason, and a "Shop This" affiliate link to Amazon.

### Core User Flow
1. User lands on homepage → sees headline + CTA ("Find My Fit")
2. User answers 5-question quiz (one question per screen or all on one page)
3. User clicks "Get My Fit"
4. App sends quiz answers + product catalog to Claude API
5. Claude returns 4 product IDs (top, bottom, shoes, accessory) with a one-line reason for each
6. App renders the Outfit Results page with product cards + Shop This buttons
7. User clicks "Shop This" → opens Amazon affiliate link in new tab

### 5 Quiz Questions
| # | Question | Input Type | Options |
|---|----------|------------|---------|
| 1 | What type of workout do you do? | Single select | Lifting, Cardio/Running, CrossFit/HIIT, Yoga/Pilates, General Gym |
| 2 | What's your budget? | Single select | Under $50, $50–$100, $100–$200, No limit |
| 3 | What's your style vibe? | Single select | Minimal & Clean, Bold & Loud, All Black Everything, Colorful & Fun |
| 4 | What's your gender? | Single select | Men, Women, Unisex |
| 5 | What's your body type / fit preference? | Single select | Slim/Compression, Regular Fit, Oversized/Relaxed |

### Product Catalog Format (products.json)
```json
[
  {
    "id": "top-001",
    "category": "top",
    "name": "Nike Dri-FIT Training Shirt",
    "price": 35,
    "gender": ["men", "unisex"],
    "style": ["minimal", "all-black"],
    "workout": ["lifting", "general-gym", "hiit"],
    "budget_max": 50,
    "fit": ["regular", "slim"],
    "affiliate_url": "https://www.amazon.com/dp/ASIN?tag=YOUR_ASSOCIATE_TAG",
    "image_url": "https://..."
  }
]
```

Each product has: id, category (top/bottom/shoes/accessory), name, price, gender, style, workout, budget_max, fit, affiliate_url, image_url.

### Claude API Prompt (Step 4)
```
You are a gym outfit stylist for Fenix Fit Finder.

User profile:
- Workout type: {workout}
- Budget: {budget}
- Style vibe: {style}
- Gender: {gender}
- Fit preference: {fit}

Product catalog (JSON):
{products_json}

Select exactly 4 products: one top, one bottom, one pair of shoes, one accessory.
Rules:
- Match the user's gender, workout type, style, budget, and fit preference
- Never exceed the user's budget for any single item
- Pick the best possible combination

Respond ONLY with this JSON (no markdown, no explanation):
{
  "top": { "id": "...", "reason": "one sentence why" },
  "bottom": { "id": "...", "reason": "one sentence why" },
  "shoes": { "id": "...", "reason": "one sentence why" },
  "accessory": { "id": "...", "reason": "one sentence why" }
}
```

### Pages & Components

**Pages:**
- `/` — Homepage (hero, tagline, CTA button)
- `/quiz` — 5-question quiz
- `/results` — Outfit results (4 product cards)

**Components:**
- `QuizCard.tsx` — Single question with selectable options
- `ProductCard.tsx` — Product name, price, reason, image, "Shop This" button
- `OutfitGrid.tsx` — 2x2 grid of 4 ProductCards
- `LoadingScreen.tsx` — "Building your fit..." animation while API call runs

### Affiliate Links
- Replace `YOUR_ASSOCIATE_TAG` in all product affiliate_urls with your Amazon Associates tag
- "Shop This" button opens affiliate_url in a new tab (`target="_blank"`)
- Track clicks optionally with a console.log or analytics event

### Non-Goals (V1)
- No user accounts or saved outfits
- No payment processing
- No user-uploaded photos
- No backend server
- No database
- No admin dashboard

### Success Metrics
- Quiz completion rate
- "Shop This" click rate
- Amazon affiliate earnings

---

## Product Catalog Starter (paste into products.json to start)

Create `src/data/products.json` with 30–50 products manually curated from Amazon Associates.
Each product must have a real Amazon affiliate URL with your tag appended:
`https://www.amazon.com/dp/ASIN?tag=YOUR_TAG`

Suggested breakdown:
- 10–12 tops (mix of men/women/unisex, styles, workout types)
- 10–12 bottoms (shorts, leggings, joggers)
- 8–10 shoes (training shoes, running shoes)
- 6–8 accessories (belts, bags, headbands, gloves, water bottles)

---

## Build Order

### Step 1 — Project Setup
```bash
npm create vite@latest fenix-fit-finder -- --template react-ts
cd fenix-fit-finder
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom
```
Configure Tailwind in `tailwind.config.js` and `index.css`.
Set up React Router with routes: `/`, `/quiz`, `/results`.
Run app and confirm it loads.

### Step 2 — Product Catalog
- Create `src/data/products.json` with 5–10 placeholder products (real ones added later)
- Create `src/types/product.ts` with the Product TypeScript interface
- Create `src/utils/catalog.ts` with helper functions to filter products by category

### Step 3 — Quiz UI
- Create `src/pages/Quiz.tsx`
- Create `src/components/QuizCard.tsx`
- State: track answer for each of the 5 questions
- Navigation: "Next" button advances to next question, progress bar at top
- Final question → "Get My Fit" button → navigate to `/results` with quiz answers in state

### Step 4 — Claude AI Integration
- Create `src/utils/claude.ts`
- Function: `getOutfitRecommendation(answers, products)` → calls Anthropic API
- API key stored in `.env` as `VITE_ANTHROPIC_API_KEY`
- Parse Claude's JSON response, look up full product objects by ID

### Step 5 — Results Page
- Create `src/pages/Results.tsx`
- Create `src/components/ProductCard.tsx` — shows image, name, price, reason, Shop This button
- Create `src/components/OutfitGrid.tsx` — 2x2 grid layout
- "Shop This" opens affiliate_url in new tab
- "Start Over" button navigates back to `/quiz`

### Step 6 — Mobile Responsive
- Ensure quiz and results pages look great on mobile (375px+)
- ProductCard stacks vertically on small screens
- Touch-friendly tap targets (min 44px)

### Step 7 — Brand Polish
- Fenix brand colors: dark background (#0D0D0D), orange accent (#FF6B00), white text
- Font: Inter or similar clean sans-serif (Google Fonts)
- Homepage hero: bold tagline ("Your Next Gym Fit. Powered by AI."), flame or phoenix logo placeholder
- Smooth transitions between quiz questions

### Step 8 — Vercel Deployment
- Push to GitHub
- Connect repo to Vercel
- Add env var `VITE_ANTHROPIC_API_KEY` in Vercel project settings
- Connect custom domain wearfenix.com in Vercel dashboard (Settings → Domains)
- Update DNS at your domain registrar to point to Vercel

---

## Deployment Guide

### Services Needed
| Service | URL | Cost | Purpose |
|---------|-----|------|---------|
| Anthropic API | console.anthropic.com | Pay per use (~$0 at low volume) | Claude AI calls |
| Vercel | vercel.com | Free | Frontend hosting |
| GitHub | github.com | Free | Code repo |
| Amazon Associates | affiliate-program.amazon.com | Free | Affiliate links |

### Environment Variables
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

### Domain Setup (wearfenix.com → Vercel)
1. In Vercel: Project → Settings → Domains → Add `wearfenix.com`
2. Vercel gives you DNS records (A record or CNAME)
3. In your domain registrar (GoDaddy/Namecheap/etc): update DNS to Vercel's values
4. Wait 10–30 min for propagation

### Cost Control
- Claude API: each outfit recommendation costs ~$0.001–0.003 (very cheap)
- Add a rate limit (1 request per session) to prevent abuse
- Vercel free tier: 100GB bandwidth/month — more than enough for MVP

---

## How to Resume a Session

```
Read CLAUDE_START_HERE.md, check the Progress Tracker, scan all existing 
project files, and tell me exactly where we left off and what step is next. 
Do not write any code until I confirm.
```

---

## Credentials Checklist — Collect These Before Starting

- [ ] **Anthropic API key** — console.anthropic.com → API Keys
- [ ] **Amazon Associates tag** — affiliate-program.amazon.com → Account → Your tag (format: `yourname-20`)
- [ ] **GitHub account** — github.com
- [ ] **Vercel account** — vercel.com (sign in with GitHub)

---

Start with Step 1. Ask me before moving to each next step.