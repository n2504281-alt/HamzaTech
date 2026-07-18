# HamzaTech Project Governance Rules & Standards

This document establishes the official coding standards, architectural rules, design system, and operational guidelines for the **HamzaTech** platform. All developers (and AI assistants) must strictly adhere to these rules.

---

## 🤖 AI Instructions & Assistant Guidelines
1. **No Placeholders**: Never write placeholder functions, empty elements, or comments like `// TODO: Implement later`. All code must be complete and production-ready.
2. **Preserve Context**: Maintain all existing imports, comments, and structure unless explicitly tasked with refactoring.
3. **Type Safety**: Never use `any`. Always write strict TypeScript types/interfaces and enforce them throughout the codebase.
4. **Performance & Bundle Size**: Avoid introducing bloated external dependencies. Prefer native CSS/Tailwind or custom lightweight helper utilities.
5. **No Style Pollution**: Do not add inline styles. All styles must go through the Tailwind utility classes or the global CSS design system.

---

## 🛠️ Tech Stack Constraints
- **React/Next.js**: Next.js 15 (App Router). Always use Server Components (`page.tsx`, `layout.tsx` by default) and only mark components with `'use client'` when browser-level APIs, React hooks (state/effects), or Framer Motion are strictly required.
- **Styling**: Tailwind CSS + custom CSS custom properties (variables) for design tokens in `app/globals.css`.
- **Database & Auth**: Supabase JS Client for relational database operations, authentication, and media storage.
- **State Management**: Zustand for global client-side state (e.g., cart, UI overlays, local preferences).
- **Animations**: Framer Motion for scroll-reveals, micro-interactions, and 3D floating adjustments.

---

## 📁 Recommended Folder Structure
The codebase must be structured modularly to allow transition from a single-product showcase to a multi-product store.
```
/
├── app/                  # Next.js App Router root
│   ├── layout.tsx        # Root HTML shell, fonts, global providers
│   ├── page.tsx          # Single-product landing homepage
│   ├── cart/             # Cart checkout paths
│   ├── admin/            # Admin dashboard routes
│   └── globals.css       # Design tokens & Global Tailwind configurations
├── components/           # Reusable UI Components
│   ├── ui/               # Primitive components (buttons, dialogs, inputs via shadcn)
│   ├── animations/       # 3D interactive, parallax, and glow wrappers
│   ├── layout/           # Header, Footer, Navbar
│   └── product/          # Product specific displays (Viewer, Spec Sheets, Reviews)
├── context/              # Context Providers (Theme, Auth, Toast)
├── hooks/                # Custom React hooks (e.g., useMousePosition, useCart)
├── lib/                  # Shared utilities (Supabase client, helper functions)
├── store/                # Zustand stores (cartStore, uiStore)
├── types/                # Core TypeScript declarations
└── public/               # Static assets (3D models, SVG icons, local media)
```

---

## 🎨 Design System, Colors & Typography
All layout sizes, margins, paddings, and background elements must align with these values.

### Colors
Always use the Tailwind theme colors or CSS variables mapped in `globals.css`:
```css
:root {
  --background-light: #FAFAFA;
  --background-dark: #0B0B0B;
  --primary: #111111;
  --card-light: #FFFFFF;
  --card-dark: #171717;
  --accent: #F97316;          /* Orange Accent */
  --text-dark: #111111;
  --text-light: #FFFFFF;
  --text-secondary: #6B7280;  /* Gray-500 */
  --border: #E5E7EB;
}
```

### Fonts
- **Headings**: `Manrope` (Imported via `next/font/google`). Used for large typography, headers, price tags, and bold feature highlights.
- **Body**: `Inter` (Imported via `next/font/google`). Used for body copy, specifications, cart tables, and regular reviews.

### 3D & Depth Rules
1. **Glassmorphism**: Use translucent backgrounds (`bg-white/10` or `bg-black/40` combined with `backdrop-blur-md` and a thin border `border-white/10`).
2. **Volumetric Glow**: Create orange ambient glows using radial gradients: `radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 60%)`.
3. **Parallax & Tilts**: Keep perspective rotations subtle. Do not exceed a `rotateX(15deg)` or `rotateY(15deg)` on hover.

---

## ⚡ Performance Rules
- **Image Optimization**: Always use Next.js `<Image />` component with correct `srcset`, `sizes`, and optimized WebP formats. Never use standard `<img>` unless unavoidable.
- **Dynamic Imports**: Lazy load the 3D Product Viewer or large animation blocks using `next/dynamic` to ensure fast initial page loads.
- **Core Web Vitals**: Target:
  - **LCP (Largest Contentful Paint)**: < 2.5s
  - **FID (First Input Delay)**: < 100ms
  - **CLS (Cumulative Layout Shift)**: 0

---

## 🔒 Security Rules
- **Environment Variables**: Never commit secrets to Git. Always use `.env.local` for Supabase service keys or payment gateways, and reference them exclusively on the server side.
- **Client Supabase Policy**: Enforce strict Row Level Security (RLS) policies on all tables. The client should never be allowed to execute raw SQL or bypass auth filters.
- **Form Sanitization**: All user inputs (e.g., reviews, checkout info) must be parsed and verified on the server side using **Zod** schema validation.

---

## 🔍 SEO & Metadata Rules
- **Semantic HTML**: Use proper semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`, `<article>`).
- **Metadata**: Next.js metadata should be defined on pages. Configure structured JSON-LD data for products:
  ```json
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "HamzaTech Aura X1",
    "description": "Premium Wireless ANC Headphones",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
  ```
- **Title Structure**: `HamzaTech | Aura X1 — Premium Wireless ANC Headphones`.

---

## ♿ Accessibility Rules (a11y)
- **Contrast**: Text elements must satisfy WCAG AA standards (minimum contrast ratio of 4.5:1 against their backgrounds).
- **Keyboard Navigation**: Ensure custom cart components and checkout dialogues are accessible via keyboard tab focus.
- **Aria Labels**: All icon-only buttons (e.g., Lucide React Close, Cart Count, Theme toggles) must have explicit `aria-label` tags.
