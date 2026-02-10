# Design Tokens - v3

## Color Palette

### Brand Colors

| Token | HSL | Hex (approx) | Usage |
|-------|-----|------|-------|
| `--brand-crimson` | 348 50% 30% | #732637 | Primary brand, CTA accents, links |
| `--brand-gold` | 40 42% 48% | #AD8A45 | Secondary brand, highlights, section labels |
| `--brand-dark` | 28 18% 8% | #181410 | Dark backgrounds, footer |
| `--brand-surface` | 40 18% 96% | #F7F5F1 | Light surface areas |

### Semantic Colors

| Token | Role | Light | Dark |
|-------|------|-------|------|
| `--background` | Page background | 40 20% 98% | 28 18% 6% |
| `--foreground` | Primary text | 28 12% 10% | 38 14% 90% |
| `--card` | Card surface | 38 18% 97% | 28 14% 9% |
| `--muted` | Muted surface | 36 14% 93% | 28 10% 14% |
| `--muted-foreground` | Secondary text | 28 8% 46% | 36 8% 55% |
| `--primary` | Primary action | 348 50% 30% | 40 42% 52% |
| `--secondary` | Secondary action | 40 42% 48% | 348 50% 30% |
| `--border` | Borders | 36 10% 88% | 28 8% 16% |

### Section Backgrounds

| Class | Description | Colors |
|-------|-------------|--------|
| `.section-dark` | Deep warm dark | Gradient from hsl(28 18% 6%) to hsl(28 14% 10%) |
| `.section-warm` | Warm light surface | Gradient from hsl(40 20% 97%) to hsl(36 14% 94%) |
| `.section-accent` | Crimson accent | Gradient from hsl(348 50% 26%) to hsl(344 48% 20%) |

## Typography

### Font Families

| Element | Font Stack |
|---------|-----------|
| Body/UI | Inter, PingFang SC, Noto Sans SC, system-ui |
| Headings (h1-h4) | Noto Serif SC, PingFang SC, STSong, serif |

### Type Scale

Standard Tailwind classes used:
- Hero: `text-4xl md:text-5xl lg:text-[3.5rem]`
- Section title: `text-3xl md:text-4xl`
- Card title: `text-xl` or `text-2xl`
- Body: `text-base` (16px)
- Small/label: `text-sm` (14px)
- Micro: `text-xs` (12px)

### Section Labels

English uppercase labels above Chinese headings:
```
text-sm font-medium tracking-widest uppercase text-[hsl(var(--brand-crimson))]
```

## Spacing & Layout

### 8pt Grid System

All spacing uses Tailwind's default scale (multiples of 4px):
- Section padding: `py-24 md:py-32` (96px / 128px)
- Container: `container mx-auto px-4 sm:px-6 lg:px-8`
- Card gap: `gap-6` to `gap-8`
- Internal padding: `p-6` to `p-8`

### Border Radius

| Token | Value |
|-------|-------|
| `--radius` | 0.625rem (10px) |
| `radius-sm` | 6px |
| `radius-md` | 10px |
| `radius-lg` | 14px |
| `radius-xl` | 18px |

## Shadows

- Card default: `shadow-sm` or `shadow-md`
- Card hover: `shadow-lg` or `shadow-xl`
- CTA button: `shadow-lg shadow-[hsl(40_42%_48%/0.15)]`

## Background Patterns

### Noise Texture
`.bg-noise` class adds a subtle SVG fractal noise overlay at 3% opacity.

### Ambient Light Orbs
Used in dark sections - large blurred circles with brand colors at very low opacity:
```
bg-[hsl(40_42%_48%/0.04)] blur-[100px]
bg-[hsl(348_50%_30%/0.03)] blur-[80px]
```

### Dot Grid
Subtle dot pattern for light sections:
```
radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)
backgroundSize: 32px 32px
opacity: 0.02
```

## Component Variants

### Button

| Variant | Style |
|---------|-------|
| Primary (gold) | `bg-[hsl(40,42%,48%)] text-[hsl(28,18%,6%)]` |
| Primary (crimson) | `bg-[hsl(var(--brand-crimson))] text-white` |
| Outline | `border-[hsl(var(--brand-crimson)/0.15)] text-[hsl(var(--brand-crimson))]` |
| Ghost (dark bg) | `border-[hsl(40_42%_48%/0.25)] text-[hsl(40,48%,65%)]` |

### Badge

| Context | Style |
|---------|-------|
| Brand Advertising | `bg-[hsl(var(--brand-crimson))] text-white` |
| Culture Art | `bg-[hsl(var(--brand-gold))] text-white` |
| Industry tag | `bg-[hsl(var(--brand-crimson)/0.08)] text-[hsl(var(--brand-crimson))]` |

### Card

- Default: `border-0 shadow-md bg-white`
- Hover: `hover:shadow-xl transition-all duration-500`
- Gold accent: Add `gold-border-top` class
