# Smart-Response HQ

> AI-powered customer feedback analysis & response drafting platform — built for **Sibathon '26** by **Chomu Programmers**.

Smart-Response HQ receives customer feedback, runs it through an AI model (Llama 3.3 70B via Groq) to gauge urgency, detect sentiment, generate a summary, and draft three response tones — empathetic, professional, and concise. Admins can review tickets, pick a draft, and send the reply straight from the dashboard.

---

## Features

| Area                | What it does                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| **Customer Portal** | Submit feedback with email — stored instantly in Supabase                                      |
| **AI Analysis**     | Urgency scoring (0–100), sentiment detection, 1–2 sentence summary                             |
| **Response Drafts** | Three auto-generated drafts: empathetic, professional, concise                                 |
| **Admin Dashboard** | Browse all tickets, sort by newest / oldest / urgency, click into any ticket for full analysis |
| **Draft Viewer**    | Read the full draft, copy to clipboard, or send via Gmail / Outlook / Yahoo                    |
| **Auth**            | Password-protected admin access with 3-hour session expiry                                     |

---

## Tech Stack

| Layer     | Technology                                                               |
| --------- | ------------------------------------------------------------------------ |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack) |
| Frontend  | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com) |
| AI        | [Groq SDK](https://groq.com) — Llama 3.3 70B Versatile                   |
| Database  | [Supabase](https://supabase.com) (PostgreSQL)                            |
| Font      | [Geist](https://vercel.com/font) via `next/font`                         |

---

## Project Structure

```
src/
├── app/
│   ├── page.js                      # Landing page (Customer / Admin selector)
│   ├── layout.js                    # Root layout with FeedbackProvider
│   ├── actions.js                   # Server Actions (AI analysis, DB operations)
│   ├── globals.css                  # Tailwind theme config
│   ├── fakeData.js                  # Fallback dummy data for offline/dev
│   ├── customer/
│   │   └── page.js                  # Customer feedback submission form
│   ├── admin/
│   │   ├── page.js                  # Admin login
│   │   └── dashboard/
│   │       ├── page.js              # Ticket list with sort & filter
│   │       └── [id]/page.js         # Individual ticket detail + AI analysis
│   ├── result/
│   │   ├── page.js                  # Analysis results overview
│   │   └── draft/[key]/page.js      # Full draft viewer with email/copy actions
│   ├── api/
│   │   └── feedbacks/route.js       # GET endpoint — fetch all tickets
│   └── lib/
│       └── supabase.js              # Supabase client initialization
├── components/
│   ├── InputSection.jsx             # Email + feedback textarea form
│   └── ResultsDisplay.jsx           # Urgency badge, summary, draft cards
└── context/
    └── FeedbackContext.js           # In-memory feedback state (React Context)
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.18+
- A **Groq** API key ([console.groq.com](https://console.groq.com))
- A **Supabase** project with a `tickets` table

### 1. Clone & install

```bash
git clone https://github.com/MuneeburRehman-29/Chomu-Programmers-Sibathon26.git
cd Chomu-Programmers-Sibathon26
npm install
```

### 2. Configure environment

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

### 3. Set up the database

Create a `tickets` table in your Supabase project:

```sql
CREATE TABLE tickets (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT,
  customer_text TEXT NOT NULL,
  urgency       INTEGER,
  sentiment     TEXT,
  summary       TEXT,
  drafts        JSONB,
  final_response TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm start
```

---

## Deployment

The recommended platform is **Vercel** (native Next.js support including Server Actions and API routes).

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add the four environment variables listed above
4. Deploy

---

## How It Works

```
Customer submits feedback
        │
        ▼
  Saved to Supabase (pending)
        │
        ▼
  Admin opens ticket
        │
        ▼
  AI analysis runs (Groq / Llama 3.3 70B)
        │
        ├─ Urgency score (0-100)
        ├─ Sentiment detection
        ├─ Summary (1-2 sentences)
        └─ 3 response drafts
              │
              ▼
  Admin picks a draft → copy / email / save
```

---

## Scripts

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Start dev server (Webpack mode, 8 GB heap) |
| `npm run build` | Production build (Turbopack)               |
| `npm start`     | Serve production build                     |
| `npm run lint`  | Run ESLint                                 |

---

## Team

**Chomu Programmers** — Sibathon '26
