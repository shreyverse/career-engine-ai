# 🧭 Career Engine — AI Career Intelligence Platform

> **Phase 1: Foundation, Architecture & Design System**

Career Engine is an AI-powered platform engineered to systematically guide **freshers** and **working professionals** from their current position to their dream career milestones. 

By analyzing education, experience, verified skills, and target roles, Career Engine formulates an actionable, personalized roadmap and skill gap strategy.

---

## 🎯 What is Career Engine?

### For Freshers & University Students
Transforms ambiguity into engineering roles:
$$\text{Interest} \longrightarrow \text{Skills} \longrightarrow \text{Projects} \longrightarrow \text{Resume} \longrightarrow \text{Interview} \longrightarrow \text{Job}$$

### For Working Professionals
Accelerates promotion and compensation pivots:
$$\text{Current Role} \longrightarrow \text{Career Goal} \longrightarrow \text{Skill Gap} \longrightarrow \text{Learning Plan} \longrightarrow \text{Growth}$$

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Tooling & Bundler**: Vite
- **Styling**: Tailwind CSS with custom Obsidian Charcoal tokens
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans (Display), Inter (Body), JetBrains Mono (Technical)

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Security & Utilities**: Helmet, CORS, Morgan

### Database
- **Database**: PostgreSQL
- **ORM & Migrations**: Prisma ORM (9 fully modeled schema entities ready for Phase 2+)

---

## 📂 Project Structure

```
career-engine/
├── frontend/                     # React 18 + Vite + Tailwind Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # 16+ Reusable atomic components
│   │   │   ├── layout/           # Navbar, Footer, Sidebar, AppLayout, etc.
│   │   │   └── landing/          # Public landing sections & interactive visualizer
│   │   ├── pages/                # Landing, Auth, Onboarding, Dashboard, Modules
│   │   ├── routes/               # Declarative React Router configuration
│   │   ├── hooks/                # Custom React hooks (useToast, etc.)
│   │   ├── services/             # Typed API client with /health check
│   │   ├── constants/            # Design tokens & feature definitions
│   │   └── types/                # TypeScript shared types
│   ├── tailwind.config.js        # Design tokens & color system
│   └── package.json
│
├── backend/                      # Express + TypeScript API Server
│   ├── src/
│   │   ├── config/               # Environment & server config
│   │   ├── controllers/          # HealthController & API handlers
│   │   ├── middleware/           # Error handling, logging & CORS
│   │   ├── routes/               # API routes (/health, /api/health)
│   │   ├── services/             # Health and business logic
│   │   ├── types/                # Typed API response envelopes
│   │   ├── utils/                # Standardized response wrappers
│   │   ├── app.ts                # Express application factory
│   │   └── server.ts             # Server entry point
│   ├── tsconfig.json
│   └── package.json
│
├── prisma/
│   └── schema.prisma             # PostgreSQL schema with full Phase 2-ready entities
│
├── docs/
│   ├── architecture.md           # System architecture, data flow & security plan
│   └── design-system.md          # Visual tokens, typography scale & components
│
├── .env.example                  # Environment variable reference
├── .gitignore
├── package.json                  # Root monorepo scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v8.0.0 or higher
- **PostgreSQL**: (Optional for Phase 1 preview, required for Phase 2 DB persistence)

### 2. Installation
Clone the repository and install dependencies for both services:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration
Copy `.env.example` to configure your environment variables:

```bash
cp .env.example .env
```

---

## 💻 Running the Application

### Development Mode

You can run both frontend and backend concurrently or independently:

**Run Both Concurrently (from workspace root):**
```bash
npm run dev
```

**Run Backend API Server (Port 5000):**
```bash
cd backend
npm run dev
```
Health Check: `http://localhost:5000/health`

**Run Frontend Client (Port 3000):**
```bash
cd frontend
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🏗️ Production Build & Verification

```bash
# Build Frontend
cd frontend
npm run build

# Build Backend
cd ../backend
npm run build
```

---

## 🗺️ Application Routes

| Path | Description | Status |
| :--- | :--- | :--- |
| `/` | Public Landing Page with interactive roadmap visualizer | **Complete** |
| `/login` | User Authentication Shell | Phase 1 UI Ready |
| `/register` | Account Creation Shell | Phase 1 UI Ready |
| `/forgot-password` | Password Recovery Shell | Phase 1 UI Ready |
| `/onboarding` | Career Stage Intake Flow (Fresher vs Professional) | Phase 1 UI Ready |
| `/dashboard` | Workspace Intelligence Central Dashboard | Phase 1 UI Ready |
| `/career-path` | Milestone Sprint Roadmap Viewer | Phase 1 UI Ready |
| `/skills` | Skill Gap Matrix & Taxonomy Explorer | Phase 1 UI Ready |
| `/resume` | Resume Document & ATS Analyzer Hub | Phase 1 UI Ready |
| `/progress` | Learning Velocity & Streak Metrics | Phase 1 UI Ready |
| `/settings` | Profile & Career Preferences | Phase 1 UI Ready |

---

## 🛡️ Scope Adherence (Phase 1)
In strict alignment with Phase 1 specifications:
- ❌ No authentication logic / OAuth / JWT issuance executed
- ❌ No Gemini API calls or AI generation
- ❌ No PDF / resume parsing or file uploads
- ❌ No ATS scoring algorithms
- ❌ No assessment calculations
- ✅ Clean, enterprise-grade architecture established for all future modules.

---

## 📄 License
This project is licensed under the MIT License.
