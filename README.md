# wchat

A minimal AI chat app built with Next.js. Pick a provider (Groq or Gemini), send messages and get Markdown-rendered replies. The conversation is saved in the browser's `localStorage`.

## Features

- Multiple LLM providers: Groq (`openai/gpt-oss-120b`) and Gemini (`gemini-3.8-flash`)
- Rich-text replies (Markdown + GFM)
- Light/dark theme
- English and Portuguese UI
- API keys stay on the server (`/api/chat` proxies requests)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Radix UI · next-intl · next-themes · Biome

## Getting started

Requires Node.js 26 (see `.nvmrc`).

```bash
npm install
cp .env.example .env   # then fill in your keys
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable         | Description          |
| ---------------- | -------------------- |
| `GROQ_API_KEY`   | Groq API key         |
| `GEMINI_API_KEY` | Google Gemini API key |

You only need the key for the provider you use.

## Scripts

| npm                 | make             | Description                       |
| ------------------- | ---------------- | --------------------------------- |
| `npm run dev`       | `make dev`       | Start the dev server              |
| `npm run build`     | `make build`     | Production build                  |
| `npm run start`     | —                | Serve the production build        |
| `npm run lint`      | `make lint`      | Lint with Biome                   |
| `npm run format`    | `make format`    | Format with Biome                 |
| `npm run check`     | `make check`     | Format, lint and organize imports |
| `npm run typecheck` | `make typecheck` | TypeScript type check             |
| —                   | `make validate`  | `check` + `typecheck`             |

## Project structure

```
src/
├── app/
│   ├── api/chat/route.ts   # Server proxy to the LLM providers
│   ├── layout.tsx
│   └── page.tsx            # Chat page
├── components/             # Layout, theme and UI primitives
├── features/chat/          # Chat components, hooks and service
├── hooks/
├── lib/                    # Locale helpers and utils
└── messages/               # i18n strings (en, pt)
```

## Adding a provider

Any OpenAI-compatible API works: add an entry to `PROVIDERS` in `src/app/api/chat/route.ts` and to `PROVIDERS` in `src/features/chat/services/chatService.ts`, then add its key to `.env`.
