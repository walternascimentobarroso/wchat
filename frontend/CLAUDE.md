@AGENTS.md

# wchat — Agent Context

> Interface de chat com design glassmorphism. Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Zustand 5. Sem backend real — respostas são simuladas.

## Comandos

```bash
npm run dev       # servidor de desenvolvimento (porta 3000)
npm run build     # build de produção
npm run start     # servidor de produção
npm run lint      # ESLint
npm run tokens    # regenerar globals.css a partir de design-system.json
```

## Arquitetura

```
src/
  domains/chat/         # camada de domínio — TypeScript puro, zero dependências externas
    entities/           # Chat e Message (com toDTO / fromDTO)
    use-cases/          # um ficheiro por caso de uso
    services/           # ChatService orquestra os use cases
    types/              # tipos de domínio
  infrastructure/
    storage/            # interface ChatRepository + implementação LocalStorage
  presentation/
    components/chat/    # componentes React específicos do chat
    state/              # chatStore.ts — fonte de verdade do estado UI
    providers/          # AppProvider, ThemeProvider
  components/ui/        # primitivos shadcn/ui — não modificar diretamente
  shared/               # utilitários transversais (id, date, fakeResponses)
  app/                  # entrypoints Next.js App Router
```

### Regras de camadas

- **Domínio** não pode importar React, Next.js, nem infraestrutura.
- **Infraestrutura** não pode ser chamada diretamente dos componentes — ir sempre pelo store.
- **Componentes** não gerem estado local que deva ser partilhado — estender o `chatStore`.

## Design system

- `design-system.json` é a **fonte de verdade** para cores, glassmorphism e tipografia.
- Após editar `design-system.json`, correr `npm run tokens` para regenerar `globals.css`.
- Cores em **OKLCH** — não introduzir hex, rgb, ou HSL em código novo.
- Classes glassmorphism (`glass-panel`, `glass-surface`, `glass-chip`, `glass-frame`) são geradas — usar via `className`, nunca inline.
- Tema claro/escuro via `next-themes` — usar variantes `dark:` do Tailwind.

## Convenções

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
- **Respostas simuladas**: `generateFakeResponse` em `use-cases/` — ponto de substituição por uma API real no futuro

## Âmbito de trabalho

- Correr `npm run lint` e `npm run build` antes de considerar uma tarefa terminada
- Ao adicionar uma feature, seguir o fluxo: tipo → use case → ChatService → chatStore → componente
- Ao adicionar tokens de design, editar `design-system.json` e correr `npm run tokens`

## Documentação

- Layout e componentes: @docs/layout.md
- Segurança e auth: @docs/security.md
- Qualidade e testes: @docs/quality.md
- Base de dados: @docs/database.md