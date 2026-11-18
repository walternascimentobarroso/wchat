# Spec: chat

## Objetivo

Página web de chat para conversar com um Assistente simulado (mock). Vocabulário em [GLOSSARY.md](../GLOSSARY.md).

Referência de código, layout e convenções: `/Users/macbook/projets/wdashboard`.

## Requisitos

### Stack
1. Mesma base do wdashboard: Next.js 16 (App Router), TypeScript 7, Tailwind 4, shadcn/ui (Radix), Biome, next-intl, next-themes, lucide-react, Makefile, `globals.css` e design tokens. Código em `src/` com alias `@/*`.
2. Sem dependências de tabelas, gráficos, export ou formulários. Sem login nem backend.

### Layout
3. Topbar como a da referência: logo, LanguageSwitcher, ThemeToggle e botão "Limpar".
4. A área do chat ocupa o resto do ecrã, com o campo de texto fixo no fundo.
5. Responsivo: os balões ocupam até 85% da largura.
6. Light/dark/system; cores só via tokens.

### Conversa
7. Existe uma única Conversa, guardada em localStorage. Se o localStorage falhar, funciona só em memória sem erro.
8. Conversa vazia: mostra uma saudação, sem sugestões.
9. "Limpar" abre um dialog de confirmação (shadcn) e só depois esvazia a Conversa.

### Mensagens
10. Só texto simples, com as quebras de linha preservadas, sem Markdown.
11. Utilizador à direita; Assistente à esquerda com o ícone `Bot`. Sem hora.
12. A lista desce até ao fim a cada Mensagem nova.

### Envio
13. Enter envia e Shift+Enter muda de linha.
14. Mensagens vazias ou só com espaços são ignoradas.
15. Enquanto o Assistente responde, o campo continua editável e o envio fica bloqueado.

### Assistente mock
16. `chatService.send(text)` devolve uma Promise que resolve, após um atraso, com uma resposta escolhida ao acaso de uma lista fixa (traduzida).
17. Durante o atraso aparece o indicador "a escrever…" com Skeleton, sem spinner.
18. A UI só fala com o Assistente através do `chatService`.

### i18n
19. Todo o texto visível passa pelo next-intl, em pt e en.

## Concluído quando

- Todos os requisitos acima estão cumpridos.
- `make validate` (Biome + typecheck) passa.
- Verificação visual com Playwright em light e dark, em desktop e mobile.
