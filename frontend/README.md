# wchat

A modern chat interface built with Next.js 16 and React 19, following Clean Architecture principles. Features a glassmorphism design system, dark/light theme, and markdown rendering.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, shadcn/ui, Tailwind CSS v4 |
| State | Zustand 5 |
| Persistence | localStorage (via repository pattern) |
| Styling | OKLCH color tokens, glassmorphism design system |
| Language | TypeScript 5 |

## Architecture

The project follows **Clean Architecture** with clear separation between layers:

```
src/
├── domains/chat/          # Domain layer — pure business logic
│   ├── entities/          # Chat and Message domain objects
│   ├── use-cases/         # One file per use case (createChat, sendMessage, …)
│   ├── services/          # ChatService orchestrates use cases
│   └── types/             # Domain type definitions
│
├── infrastructure/        # Infrastructure layer — I/O adapters
│   └── storage/           # ChatRepository interface + LocalStorage implementation
│
├── presentation/          # Presentation layer — UI concerns
│   ├── components/chat/   # Chat-specific React components
│   ├── state/             # Zustand store (chatStore.ts)
│   └── providers/         # App and Theme providers
│
├── components/ui/         # shadcn/ui primitives (Button, Input, Sheet, …)
├── shared/                # Cross-cutting utilities (id, date, fakeResponses)
└── app/                   # Next.js App Router entry points
```

### Key patterns

- **Repository pattern**: `ChatRepository` interface in infrastructure allows swapping storage backends without touching domain logic.
- **Entity DTOs**: `Chat` and `Message` entities expose `toDTO()` / `fromDTO()` for serialization.
- **Zustand store**: `useChatStore` is the single source of truth for UI state; it wires use cases to the presentation layer.

## Design System

Design tokens live in [design-system.json](design-system.json) — the **single source of truth** for colors, glassmorphism utilities, typography, and gradients. Run the token generator to sync changes to `globals.css`:

```bash
npm run tokens
```

- Colors use the **OKLCH** color space for perceptually uniform palettes.
- Glassmorphism layers: `panel`, `surface`, `chip`, `frame` — each with light/dark variants.
- Theme switching via `next-themes`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run tokens` | Regenerate CSS tokens from `design-system.json` |

## Features

- Create and delete chat sessions
- Send messages with a simulated assistant response
- Markdown rendering in messages (via `react-markdown`)
- Typing indicator while the assistant "thinks"
- Persistent chats in `localStorage`
- Dark / light theme toggle
- Responsive layout with a collapsible sidebar (Sheet)
