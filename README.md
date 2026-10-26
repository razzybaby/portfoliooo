# Rudransh Sharma: Portfolio

Personal portfolio of **Rudransh Sharma**, B.Tech CSE student at JECRC University, Jaipur (batch 2025, roll 25BCON2412).
Built for the internal assessment: Home, About Me, Skills, Projects, Contact and an AI chatbot.

**Live site:** _add the Vercel link here after deploying_

## Design

**Blueprint**: an engineering-drawing look with a drafting grid, numbered "sheets", crop marks and a title-block contact card.
Fonts: Space Grotesk + JetBrains Mono. Dark-first with a light theme, fully responsive, and it respects *Reduce motion*.

## Technologies

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Motion (`motion/react`) for scroll-driven animation (`useScroll`, `useTransform`, `useSpring`)
- Google Gemini API (`@google/genai`) for the chatbot, called server-side only
- lucide-react icons
- Deployed on Vercel

## Features

- **Hero**: the name "decodes" from random glyphs, with a dimension line drawn under it; the grid drifts (parallax) and the title recedes as you scroll.
- **Sheet header**: fixed bar showing `SHEET 02 / 05 · ABOUT` for the section in view, a scroll-progress line and a mobile menu.
- **About**: monogram/photo frame with scroll parallax; the intro paragraph lights up word by word as you scroll.
- **Skills**: a "bill of materials" table whose rows slide in.
- **Build log**: a pinned section; on desktop the page pauses while five cards slide sideways (`useScroll` + `useTransform`).
- **Projects**: five spec-sheet cards with live search + tech filter chips and an empty state.
- **Contact**: styled as a drawing's title block.
- **Light / dark toggle**: saved in `localStorage`; on first visit it follows the device's `prefers-color-scheme`.
- **AI chatbot (Draft)**: floating button → chat panel on every section, with suggested questions, a typing indicator and friendly error messages.

All text lives in one file, **`lib/content.ts`**. The page and the chatbot both read from it.

## How the key parts work

| Feature | Where | How |
| --- | --- | --- |
| Project search + filter | `components/projects.tsx` | The search text and selected chips are React state. Each render runs `.filter()` on the projects: a project stays if its **name or any technology** contains the text **and** it matches the chip filter. Try "Python", "Quiz" or "Book". |
| Theme toggle | `components/theme-switch.tsx` + `lib/theme.ts` | A small script in `<head>` applies the saved theme (or the system one) before the page paints. The button toggles the `dark` class on `<html>` and saves the choice to `localStorage`. |
| Chatbot | `components/draft-chat.tsx` → `app/api/chat/route.ts` | Browser → `POST /api/chat` with the conversation → the server route calls **Gemini (`gemini-2.5-flash`, falling back to `gemini-2.5-flash-lite` on quota errors)** with a system prompt built from `lib/content.ts` and `GEMINI_API_KEY` from the environment → the reply is shown in the panel. Any failure shows: *"Sorry, I couldn't reach the AI right now. Please try again in a moment."* |

The API key is **never** sent to the browser: it has no `NEXT_PUBLIC_` prefix and `.env*` files are git-ignored.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then paste your key after GEMINI_API_KEY=
npm run dev
```

Open http://localhost:3000. Get a free key at https://aistudio.google.com/apikey.

## Deploy on Vercel

1. Push this folder to a new GitHub repo.
2. Import it in Vercel → **Settings → Environment Variables** → add `GEMINI_API_KEY`.
3. Deploy, then paste the live URL at the top of this README.


## Photo

No photo has been added, so an "RS" monogram is shown. To add one, put it in `public/` (e.g. `rudransh.jpg`) and set `photo: "/rudransh.jpg"` in `lib/content.ts`.
