# Fenix Fit Finder — Product Requirements Document

**Version:** 1.0 (MVP)
**Domain:** wearfenix.com
**Stack:** React + TypeScript · Vercel (free) · Anthropic Claude API
**Monetization:** Amazon Associates affiliate links
**Status:** Pre-build

---

## 1. Product Overview

Fenix Fit Finder is an AI-powered gym outfit recommender. Users answer 5 quick questions about their workout style, budget, gender, style preference, and fit preference. Claude AI reads a curated catalog of 30–50 products and returns a complete outfit — one top, one bottom, one pair of shoes, and one accessory — each with a product name, price, one-line reason, and a "Shop This" button linked to an Amazon Associates affiliate URL.

**Core value loop:**
User answers quiz → Claude picks outfit from catalog → User clicks "Shop This" → Amazon purchase → Affiliate commission

---

## 2. Goals

### MVP Goals
- Ship a working, live web app at wearfenix.com within 1–2 weeks
- Generate affiliate clicks from Day 1
- Keep hosting and running costs at $0
- Require no user accounts, no backend, no database

### Non-Goals (V1)
- User accounts or saved outfits
- Photo upload / virtual try-on
- Admin dashboard
- Payment processing
- Email capture or CRM
- Multiple affiliate networks (Amazon only for MVP)

---

## 3. User Flow

```
Landing Page (/)
    ↓  click "Find My Fit"
Quiz Page (/quiz)
    → Q1: Workout type
    → Q2: Budget
    → Q3: Style vibe
    → Q4: Gender
    → Q5: Fit preference
    ↓  click "Get My Fit"
Loading Screen (2–4 sec)
    ↓  Claude API call resolves
Results Page (/results)
    → 4 product cards (top / bottom / shoes / accessory)
    → Each card: image, name, price, reason, "Shop This" button
    ↓  click "Shop This"
Amazon affiliate URL (new tab)
```

---

## 4. Pages & Components

### 4.1 Landing Page (`/`)

**Purpose:** Convert visitors into quiz takers.

**Content:**
- Navbar: FENIX logo (left) · "AI Gym Fit" tag (right)
- Hero section:
  - Flame/phoenix icon or logo
  - Eyebrow: "POWERED BY CLAUDE AI"
  - Headline: "Your next gym fit. Built for how you move."
  - Subtext: "Answer 5 quick questions. Get a full outfit matched to your workout and style."
  - CTA button: "Find My Fit →"
  - Social proof line: "Free · No account needed · 30 seconds"
- Footer: "© 2025 Fenix · Powered by Claude AI · Amazon Associates disclosure"

**Components:** `Navbar`, `HeroSection`, `Footer`

---

### 4.2 Quiz Page (`/quiz`)

**Purpose:** Collect the 5 inputs used to generate the outfit.

**UX Rules:**
- One question visible at a time (step-by-step), OR all 5 on one scrollable page
- Progress bar at top showing current step (e.g. "2 of 5")
- Selected option highlighted in orange
- "Back" and "Next" navigation buttons
- "Get My Fit" button on the final question

**5 Questions:**

| # | Question | Options |
|---|----------|---------|
| 1 | What type of workout do you do? | Lifting · Cardio/Running · CrossFit/HIIT · Yoga/Pilates · General Gym |
| 2 | What's your budget per item? | Under $50 · $50–$100 · $100–$200 · No limit |
| 3 | What's your style vibe? | Minimal & Clean · Bold & Loud · All Black Everything · Colorful & Fun |
| 4 | What's your gender? | Men · Women · Unisex |
| 5 | What's your fit preference? | Slim/Compression · Regular Fit · Oversized/Relaxed |

**State:** Store answers in React `useState`. Pass as query params or React Router state to `/results`.

**Components:** `QuizScreen`, `QuizCard`, `ProgressBar`, `OptionButton`

---

### 4.3 Loading Screen

**Purpose:** Keep users engaged during the 2–4 second Claude API call.

**Content:**
- Animated flame or spinner in Fenix orange
- Rotating text: "Analyzing your style...", "Matching your workout...", "Building your fit..."

**Components:** `LoadingScreen`

---

### 4.4 Results Page (`/results`)

**Purpose:** Display the AI-generated outfit and drive affiliate clicks.

**Content:**
- Header: "YOUR FIT" label + "Built for your [workout type] session"
- 2×2 grid of 4 ProductCards
- "Start Over" link at bottom

**ProductCard structure:**
```
[Product Image]
CATEGORY LABEL (TOP / BOTTOM / SHOES / ACCESSORY)
Product Name
$Price
One-line reason Claude generated
[Shop This →]  ← Amazon affiliate link, opens new tab
```

**Affiliate disclosure:** Small italic line below the grid: "As an Amazon Associate, Fenix earns from qualifying purchases."

**Components:** `ResultsPage`, `OutfitGrid`, `ProductCard`

---

## 5. Data Model

### 5.1 Product Schema (`src/data/products.json`)

```typescript
interface Product {
  id: string;             // "top-001"
  category: "top" | "bottom" | "shoes" | "accessory";
  name: string;           // "Nike Dri-FIT Training Shirt"
  price: number;          // 35  (USD, no cents needed)
  gender: ("men" | "women" | "unisex")[];
  style: ("minimal" | "bold" | "all-black" | "colorful")[];
  workout: ("lifting" | "cardio" | "hiit" | "yoga" | "general-gym")[];
  budget_max: number;     // highest price tier this fits (50, 100, 200, 999)
  fit: ("slim" | "regular" | "oversized")[];
  affiliate_url: string;  // "https://www.amazon.com/dp/ASIN?tag=YOUR_TAG"
  image_url: string;      // hosted image URL or local /public path
}
```

### 5.2 Quiz Answers Schema

```typescript
interface QuizAnswers {
  workout: "lifting" | "cardio" | "hiit" | "yoga" | "general-gym";
  budget: "under-50" | "50-100" | "100-200" | "no-limit";
  style: "minimal" | "bold" | "all-black" | "colorful";
  gender: "men" | "women" | "unisex";
  fit: "slim" | "regular" | "oversized";
}
```

### 5.3 Claude API Response Schema

```typescript
interface OutfitRecommendation {
  top:       { id: string; reason: string };
  bottom:    { id: string; reason: string };
  shoes:     { id: string; reason: string };
  accessory: { id: string; reason: string };
}
```

---

## 6. Claude AI Integration

### 6.1 API Call

**File:** `src/utils/claude.ts`
**Model:** `claude-sonnet-4-6`
**Trigger:** User clicks "Get My Fit" on final quiz question

```typescript
async function getOutfitRecommendation(
  answers: QuizAnswers,
  products: Product[]
): Promise<OutfitRecommendation>
```

### 6.2 System Prompt

```
You are a gym outfit stylist for Fenix Fit Finder.
You always respond with valid JSON only. No markdown. No explanation outside the JSON.
```

### 6.3 User Prompt Template

```
User profile:
- Workout type: {answers.workout}
- Budget per item: {answers.budget}
- Style vibe: {answers.style}
- Gender: {answers.gender}
- Fit preference: {answers.fit}

Product catalog:
{JSON.stringify(products)}

Select exactly 4 products: one top, one bottom, one pair of shoes, and one accessory.

Rules:
- Each product must match the user's gender (or be unisex)
- No product price may exceed the user's budget ceiling
- Prioritize workout type and style vibe as primary filters
- Choose the best combination that looks cohesive together

Respond ONLY with this exact JSON structure:
{
  "top":       { "id": "...", "reason": "one sentence why this top fits the user" },
  "bottom":    { "id": "...", "reason": "one sentence why" },
  "shoes":     { "id": "...", "reason": "one sentence why" },
  "accessory": { "id": "...", "reason": "one sentence why" }
}
```

### 6.4 Error Handling
- If Claude returns malformed JSON → catch parse error → show "Something went wrong. Try again." with retry button
- If no product matches a category → fall back to the highest-rated product in that category regardless of filters
- Network timeout (>10s) → show error state

### 6.5 Cost Estimate
- Input tokens per call: ~1,500–2,000 (catalog + prompt)
- Output tokens per call: ~200
- Cost per call: ~$0.002 at claude-sonnet-4-6 pricing
- 1,000 users/month = ~$2.00 in API costs

---

## 7. Product Catalog — Curation Guide

### Volume
- 30–50 products total for MVP
- Distribution: 12 tops · 12 bottoms · 12 shoes · 8–10 accessories

### Per Category Targets

**Tops (12):**
- 3 men's lifting shirts (Nike, Under Armour, Gymshark)
- 3 women's sports bras / tanks (Lululemon lookalike, Gymshark, Amazon brand)
- 2 unisex hoodies (all-black, minimal)
- 2 women's long sleeve
- 2 bold/colorful options

**Bottoms (12):**
- 4 men's shorts (lifting, cardio, all-black, bold)
- 4 women's leggings (minimal, colorful, all-black, compression)
- 2 men's joggers
- 2 women's shorts

**Shoes (12):**
- 3 men's training shoes (lifting-focused: flat, stable)
- 3 men's running shoes (cushion, lightweight)
- 3 women's training shoes
- 3 women's running shoes

**Accessories (8–10):**
- Gym gloves / wrist wraps (2)
- Water bottles (2)
- Gym bags (2)
- Headbands / sweatbands (1–2)
- Resistance bands (1)

### Amazon Associates Setup
1. Sign up at affiliate-program.amazon.com
2. Get your Associate tag (format: `yourname-20`)
3. For each product: find the ASIN from the Amazon product URL
4. Build affiliate URL: `https://www.amazon.com/dp/{ASIN}?tag={YOUR_TAG}`
5. Paste into `affiliate_url` field in products.json

---

## 8. Branding & Design

### Color Palette
| Token | Hex | Use |
|-------|-----|-----|
| Background | `#0D0D0D` | Page, cards, nav |
| Card surface | `#111111` | Product cards |
| Card border | `#222222` | Card outlines |
| Orange accent | `#FF6B00` | CTA, selected state, prices, logo |
| White | `#FFFFFF` | Headlines |
| Muted text | `#888888` | Body copy, labels |
| Subtle text | `#555555` | Meta copy, reasons |

### Typography
- Font: Inter (Google Fonts) or system-ui fallback
- Headline: 28px / weight 500 / white
- Body: 14px / weight 400 / muted gray
- Buttons: 15px / weight 500 / white or orange
- Labels: 11px / weight 500 / orange / letter-spacing 0.1em

### Logo / Mark
- Wordmark: "FENIX" in all caps, orange, letter-spacing 0.08em
- Icon: flame emoji (🔥) or custom SVG phoenix mark (V2)

---

## 9. Tech Stack (Full Detail)

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | React 18 + TypeScript | Vite for build tooling |
| Styling | Tailwind CSS | Custom config with Fenix color tokens |
| Routing | React Router v6 | Three routes: `/`, `/quiz`, `/results` |
| AI | Anthropic Claude API | `claude-sonnet-4-6`, called client-side |
| Product data | Local `products.json` | No backend, no DB |
| Hosting | Vercel free tier | 100GB bandwidth/month |
| Domain | wearfenix.com | Connect via Vercel dashboard |
| Analytics | Vercel Analytics (free) | Page views, quiz completions |

**Environment variables (`.env`):**
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_AMAZON_ASSOCIATE_TAG=yourname-20
```

---

## 10. File Structure

```
fenix-fit-finder/
├── public/
│   ├── favicon.ico
│   └── og-image.jpg          ← social share image
├── src/
│   ├── data/
│   │   └── products.json     ← the entire catalog lives here
│   ├── types/
│   │   └── product.ts        ← Product, QuizAnswers, OutfitRecommendation interfaces
│   ├── utils/
│   │   ├── claude.ts         ← getOutfitRecommendation()
│   │   └── catalog.ts        ← filterByCategory(), getProductById()
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── QuizCard.tsx
│   │   ├── OptionButton.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── OutfitGrid.tsx
│   │   └── LoadingScreen.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Quiz.tsx
│   │   └── Results.tsx
│   ├── App.tsx               ← router setup
│   ├── main.tsx
│   └── index.css             ← Tailwind base + custom globals
├── .env                      ← API keys (gitignored)
├── .env.example              ← template for reference
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── CLAUDE_START_HERE.md
```

---

## 11. SEO & Social

### Meta Tags (`index.html`)
```html
<title>Fenix Fit Finder — AI Gym Outfit Recommender</title>
<meta name="description" content="Answer 5 quick questions. Get a complete, personalized gym outfit powered by Claude AI. Free, no account needed.">
<meta property="og:title" content="Fenix Fit Finder">
<meta property="og:description" content="Your next gym fit, powered by AI.">
<meta property="og:image" content="https://wearfenix.com/og-image.jpg">
<meta property="og:url" content="https://wearfenix.com">
<meta name="twitter:card" content="summary_large_image">
```

---

## 12. TikTok Content Strategy (Traffic Source)

**Account:** @wearfenix (or @fenixfitfinder)

**Content pillars:**
1. "Rate my gym fit" reaction videos → CTA: "Get your AI outfit at wearfenix.com"
2. "I let AI pick my gym outfit for a week" series
3. Outfit breakdowns: show each product, click affiliate link in bio
4. Before/after: bad gym fit → Fenix recommendation
5. Stitch/duet trending gym content

**Link in bio:** wearfenix.com
**Goal:** 3–5 posts/week at launch, targeting gym/fitness niche

---

## 13. Affiliate Disclosure (Legal Requirement)

Required on site per FTC guidelines and Amazon Associates terms:

> "Fenix is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com."

Place in: site footer, results page below the outfit grid.

---

## 14. Launch Checklist

- [ ] 30+ products in products.json with real affiliate URLs
- [ ] Anthropic API key in Vercel env vars
- [ ] wearfenix.com connected in Vercel dashboard
- [ ] Affiliate disclosure visible on results page and footer
- [ ] Mobile-responsive (test at 375px)
- [ ] Quiz completion works end-to-end
- [ ] "Shop This" links open in new tab
- [ ] Error state works if Claude call fails
- [ ] OG image set for social sharing
- [ ] TikTok account created, first post scheduled

---

## 15. V2 Ideas (Post-MVP)

- Save / share outfit results via URL
- "Refresh" button to get alternate outfit suggestion
- Filter results by brand
- Email capture for weekly outfit drops
- Photo upload: AI picks outfit based on photo of user's current gym gear
- Dark/light mode toggle
- Expand to non-Amazon affiliate networks (ShareASale, Impact)