@AGENTS.md

# wchat — Agent Context

> Interface de chat com design glassmorphism. Monorepo com frontend (Next.js) e backend (FastAPI).

## Estrutura do monorepo

```
wchat/
  frontend/   # Next.js 16, React 19, TypeScript, Tailwind CSS v4, Zustand 5
  backend/    # FastAPI, Python, streaming via text/plain
```

## Comandos (raiz)

```bash
npm run dev           # frontend (3000) + backend (8000) em simultâneo
npm run dev:frontend  # só frontend
npm run dev:backend   # só backend
npm run install:all   # instalar dependências frontend + backend
```

## Comandos (frontend/)

```bash
npm run dev       # servidor de desenvolvimento (porta 3000)
npm run build     # build de produção
npm run lint      # ESLint
npm run tokens    # regenerar globals.css a partir de design-system.json
```

## Comandos (backend/)

```bash
uvicorn app.main:app --reload   # servidor de desenvolvimento (porta 8000)
pip install -r requirements.txt
```

## Arquitetura frontend

```
src/
  domains/chat/         # camada de domínio — TypeScript puro, zero dependências externas
    entities/           # Chat e Message (com toDTO / fromDTO)
    use-cases/          # um ficheiro por caso de uso
    services/           # ChatService orquestra os use cases
    types/              # tipos de domínio
  infrastructure/
    storage/            # interface ChatRepository + implementação LocalStorage
    api/                # chatApi.ts — streaming fetch para o backend FastAPI
  presentation/
    components/chat/    # componentes React específicos do chat
    state/              # chatStore.ts — fonte de verdade do estado UI
    providers/          # AppProvider, ThemeProvider
  components/ui/        # primitivos shadcn/ui — não modificar diretamente
  shared/               # utilitários transversais (id, date)
  app/                  # entrypoints Next.js App Router
```

## Arquitetura backend

```
backend/
  app/
    main.py             # FastAPI app, CORS
    routers/chat.py     # POST /chat/message → StreamingResponse
    services/chat_service.py  # lógica de resposta (substituir por LLM aqui)
    models/chat.py      # Pydantic models
  requirements.txt
```

### Regras de camadas (frontend)

- **Domínio** não pode importar React, Next.js, nem infraestrutura.
- **Infraestrutura** não pode ser chamada diretamente dos componentes — ir sempre pelo store.
- **Componentes** não gerem estado local que deva ser partilhado — estender o `chatStore`.

### Fluxo de streaming

`chatStore.sendMessage` → `infrastructure/api/chatApi.streamChatMessage` → `POST /chat/message` → `StreamingResponse` (text/plain) → tokens chegam via `ReadableStream` e atualizam a mensagem do assistente no store incrementalmente.

## Design system

- `design-system.json` é a **fonte de verdade** para cores, glassmorphism e tipografia.
- Após editar `design-system.json`, correr `npm run tokens` para regenerar `globals.css`.
- Cores em **OKLCH** — não introduzir hex, rgb, ou HSL em código novo.
- Classes glassmorphism (`glass-panel`, `glass-surface`, `glass-chip`, `glass-frame`) são geradas — usar via `className`, nunca inline.
- Tema claro/escuro via `next-themes` — usar variantes `dark:` do Tailwind.

## Convenções (frontend)

- Ficheiros: `kebab-case.tsx`; componentes: `PascalCase`
- `"use client"` apenas quando estritamente necessário (event handlers, hooks de browser)
- Props com tipos explícitos — nunca `any`
- Usar `cn()` de `src/lib/utils.ts` para classes condicionais

## O que NÃO fazer

- Nunca modificar ficheiros em `src/components/ui/` — são primitivos shadcn, compô-los em vez de editar
- Nunca chamar `LocalStorageChatRepository` diretamente nos componentes — usar o store
- Nunca usar hex/rgb/HSL para cores — OKLCH via tokens
- Nunca criar estado global fora do `chatStore` — estender o store existente
- Nunca usar `pages/` — o projeto usa App Router

## Decisões de arquitetura

- **Zustand em vez de Context**: evita re-renders desnecessários e simplifica actions assíncronas
- **Repository pattern**: `ChatRepository` permite trocar localStorage por uma API futura sem tocar no domínio
- **shadcn/ui**: componentes copiados para `src/components/ui/` — editáveis mas tratados como primitivos
- **Streaming real**: `chatApi.ts` em infraestrutura — ponto de substituição por um LLM real no futuro (só mudar `chat_service.py`)

## Âmbito de trabalho

- Correr `npm run lint` e `npm run build` (em `frontend/`) antes de considerar uma tarefa terminada
- Ao adicionar uma feature, seguir o fluxo: tipo → use case → ChatService → chatStore → componente
- Ao adicionar tokens de design, editar `design-system.json` e correr `npm run tokens`
- Para substituir por um LLM real: editar apenas `backend/app/services/chat_service.py`

## Documentação

- Layout e componentes: @docs/layout.md
- Segurança e auth: @docs/security.md
- Qualidade e testes: @docs/quality.md
- Base de dados: @docs/database.md
