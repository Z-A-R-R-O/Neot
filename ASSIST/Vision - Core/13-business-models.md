# Business Models — Detailed Specification

## Overview
Multi-tier revenue model combining B2C (direct to learners), B2B (schools/institutions), and B2B2C (marketplace) approaches.

## Revenue Streams

### 1. Freemium (B2C)

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 5 courses, basic quizzes, limited AI (10 queries/month), ads |
| **Pro** | $9.99/month | Unlimited courses, all block types, AI tutor (unlimited), offline, no ads |
| **Family** | $19.99/month | Up to 5 family accounts, parental dashboard, screen time controls |
| **Lifetime** | $299 one-time | All Pro features forever, early access to new features |

### 2. Schools SaaS (B2B)

| Plan | Price | Features |
|------|-------|----------|
| **Starter** | $99/month | Up to 100 students, 5 teachers, basic analytics |
| **Standard** | $299/month | Up to 500 students, 25 teachers, advanced analytics, custom branding |
| **Enterprise** | Custom | Unlimited, dedicated support, custom integrations, SLA, on-premise option |

Schools pricing includes:
- All student features
- Teacher dashboard
- Parent access
- Admin controls
- White-label option (custom domain, logo, colors)
- Training and onboarding
- Priority support

### 3. Creator Marketplace (B2B2C)

| Role | Commission | Details |
|------|------------|---------|
| **Free Teacher** | 20% | Publish up to 3 courses |
| **Pro Teacher** | $19.99/month + 10% | Unlimited courses, advanced analytics, priority support |
| **Premium Creator** | $49.99/month + 5% | AI content generation, custom certificates, marketing tools |

Course pricing tiers:
- Free courses (lead generation)
- $4.99 - $19.99 (individual courses)
- $29.99 - $99.99 (course bundles)
- $199 - $499 (full certification programs)

### 4. White Label (B2B)

For large institutions, governments, NGOs:

| Feature | Price Range |
|---------|-------------|
| Custom domain | $500 setup |
| Full branding (logo, colors, fonts) | $1,000 setup |
| Custom mobile app (Play Store + App Store) | $5,000 setup |
| Dedicated server/on-premise | $10,000+ setup |
| Annual maintenance | 20% of setup |

### 5. Premium AI Credits

AI usage limits with top-up system:

| Credit Pack | Price | Usage |
|-------------|-------|-------|
| 100 AI queries | $4.99 | ~1 month casual use |
| 500 AI queries | $19.99 | ~1 month heavy use |
| 2,000 AI queries | $59.99 | ~1 semester |
| Unlimited AI | Included in Pro/Family | |

### 6. Advertising (Free Tier Only)

- Non-intrusive, educational-appropriate ads
- Video ads between lessons (optional, rewarded with XP)
- Sponsored content (universities, colleges)
- Ad-free upgrade prompt

## Pricing Strategy by Region

| Region | Free Tier | Pro Tier | Family Tier |
|--------|-----------|----------|-------------|
| US/EU | Full free tier | $9.99/mo | $19.99/mo |
| India | Full free tier | ₹199/mo ($2.40) | ₹399/mo ($4.80) |
| SE Asia | Full free tier | $3.99/mo | $7.99/mo |
| LATAM | Full free tier | $4.99/mo | $9.99/mo |
| Africa | Full free tier | $2.99/mo | $5.99/mo |

Regional pricing is 40-70% lower than US pricing, optimized for purchasing power parity.

## Revenue Projections (Year 1-3)

### Year 1: Validation

| Stream | Monthly Users | Conversion | Revenue/Month |
|--------|---------------|------------|---------------|
| Free | 50,000 | — | $0 |
| Pro | 2,500 | 5% | $24,975 |
| Family | 500 | 1% | $9,995 |
| Schools (Starter) | 20 | — | $1,980 |
| Schools (Standard) | 5 | — | $1,495 |
| Marketplace | 50 courses | — | $500 |
| **Total** | | | **~$39,000/mo** |

### Year 2: Growth

| Stream | Monthly Users | Conversion | Revenue/Month |
|--------|---------------|------------|---------------|
| Free | 500,000 | — | $0 |
| Pro | 25,000 | 5% | $249,750 |
| Family | 5,000 | 1% | $99,950 |
| Schools | 100 | — | $25,000 |
| Marketplace | 1,000 courses | — | $10,000 |
| White Label | 5 | — | $8,333 |
| **Total** | | | **~$393,000/mo** |

### Year 3: Scale

| Stream | Monthly Users | Conversion | Revenue/Month |
|--------|---------------|------------|---------------|
| Free | 2,000,000 | — | $0 |
| Pro | 100,000 | 5% | $999,000 |
| Family | 20,000 | 1% | $399,800 |
| Schools | 500 | — | $100,000 |
| Marketplace | 5,000 courses | — | $50,000 |
| White Label | 25 | — | $25,000 |
| AI Credits | 10,000 purchases | — | $50,000 |
| **Total** | | | **~$1,624,000/mo** |

## Key Metrics to Track

| Metric | Target (Year 1) | Target (Year 3) |
|--------|-----------------|-----------------|
| DAU/MAU Ratio | 30% | 50% |
| Free → Paid Conversion | 5% | 10% |
| Monthly Churn | < 8% | < 5% |
| Customer Acquisition Cost | $5 | $3 |
| Lifetime Value (LTV) | $120 | $300 |
| LTV/CAC Ratio | 24:1 | 100:1 |
| Net Promoter Score | 40+ | 60+ |
| School Renewal Rate | 85% | 95% |

## Payment Providers

| Region | Primary | Secondary |
|--------|---------|-----------|
| Global | Stripe | PayPal |
| India | Razorpay | Cashfree |
| SE Asia | Xendit | Midtrans |
| LATAM | Mercado Pago | Stripe |
| Africa | Flutterwave | Paystack |

## Business Model Canvas

```
Key Partners:
  - Schools & universities
  - Content creators/teachers
  - Cloud providers (Vercel, Supabase)
  - AI providers (OpenAI)
  - Payment gateways

Key Activities:
  - Platform development
  - Content moderation
  - Customer support
  - Sales to schools
  - Creator onboarding

Value Propositions:
  - Adaptive learning for every student
  - No-code lesson creation for teachers
  - Full control admin panel
  - Lightweight, works anywhere
  - Kid-safe, parent-approved

Customer Segments:
  - K-12 students (5-18)
  - Teachers & educators
  - Parents
  - Schools & institutions
  - Adult learners

Revenue Streams:
  - Freemium subscriptions
  - School SaaS
  - Marketplace commissions
  - White label licensing
  - AI credit packs
