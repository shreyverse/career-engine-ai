# Career Engine — Design System Specification

## 1. Design Philosophy
Career Engine adopts an **editorial + modern product design aesthetic** built for an AI career intelligence platform. It conveys credibility, analytical clarity, calmness, and premium craftsmanship.

### Principles:
- **Purposeful Hierarchy**: Every visual component communicates state, progression, or data.
- **Generous Whitespace & Precision**: High-density information is made digestible via systematic spacing.
- **No Gimmicks**: Avoids neon glow spam, heavy glassmorphism, or decorative clutter.

---

## 2. Color System Tokens

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `background` | `#090D16` | Obsidian Charcoal deep base background |
| `surface` | `#0F172A` | Standard card and container surface |
| `surface-elevated` | `#131D31` | Elevated modals, hover states, cards |
| `surface-highlight` | `#18243C` | Interactive highlights and active states |
| `surface-subtle` | `#0C121E` | Muted wells and dashed drop zones |
| `border` | `#1E293B` | Default structural border |
| `primary` | `#6366F1` | Primary Indigo brand accent |
| `primary-hover` | `#4F46E5` | Active/hover state for primary actions |
| `primary-light` | `#818CF8` | Subtle text highlights & badges |
| `secondary` | `#8B5CF6` | Violet secondary accent |
| `accent-emerald` | `#10B981` | Success state, verified skills, readiness score |
| `accent-amber` | `#F59E0B` | Warning state, skill gaps, streak indicators |
| `accent-rose` | `#F43F5E` | Error state, destructive actions, missing prerequisites |
| `text` | `#F8FAFC` | High-contrast primary reading text |
| `text-muted` | `#94A3B8` | Slate secondary body text |
| `text-dim` | `#64748B` | Labels, timestamps, and metadata |

---

## 3. Typography Scale

Three intentional typefaces are loaded:

1. **Display Headings**: `Plus Jakarta Sans` (`font-display`)
   - Large Hero: `64px+` / `leading-[1.1]` / `font-extrabold`
   - Section Title (H1/H2): `36px - 48px` / `font-bold`
   - Card Heading (H3): `20px - 24px` / `font-bold`
2. **Body & UI Text**: `Inter` (`font-sans`)
   - Body Regular: `16px` / `leading-relaxed`
   - UI Controls / Inputs: `14px` / `font-medium`
   - Captions / Footers: `12px` / `font-normal`
3. **Technical & Metrics**: `JetBrains Mono` (`font-mono`)
   - Big Metrics: `24px - 32px` / `font-bold`
   - Badges & Status: `11px - 12px` / `font-medium` / `tracking-wide`
   - Code & Schema: `13px`

---

## 4. Reusable UI Components Catalog

1. **Buttons**: `Button` supporting `primary`, `secondary`, `ghost`, `destructive`, `outline`, sizes (`sm`, `md`, `lg`, `icon`), loading spinners, and disabled states.
2. **Form Controls**: `Input`, `PasswordInput` (with toggle), `Select`, `Textarea`, `Checkbox`, `RadioGroup`, `SearchInput` (with shortcut indicator).
3. **Feedback**: `Alert` (4 variants), `Toast` (with `useToast` hook), `Spinner`, `EmptyState`, `ErrorState`.
4. **Layout Primitives**: `Container`, `Section`, `Stack`, `Grid`, `Navbar`, `MobileNav`, `Footer`, `Sidebar`, `Breadcrumb`, `AppLayout`.
5. **Data Visualization**: `ProgressBar`, `ProgressRing`, `Metric`, `Badge`, `StatusIndicator`, `Card` (5 variants).

---

## 5. Responsive Breakpoints

- **Mobile** (`< 640px`): Single column stacked cards, hamburger drawer menu, touch-friendly `44px+` tap targets.
- **Tablet** (`640px - 1024px`): 2-column grids, collapsed sidebar on app layouts.
- **Desktop** (`1024px - 1280px`): Full 3/4 column grids, fixed workspace sidebar navigation.
- **Large Desktop** (`> 1280px`): `max-w-7xl` container constraints preventing excessive stretching.
