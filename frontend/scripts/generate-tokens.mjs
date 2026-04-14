/**
 * generate-tokens.mjs
 *
 * Reads design-system.json and rewrites the :root and .dark blocks
 * inside src/app/globals.css, keeping everything else untouched.
 *
 * Usage:
 *   npm run tokens
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// ── Load sources ──────────────────────────────────────────────────────────────

const ds = JSON.parse(readFileSync(resolve(root, 'design-system.json'), 'utf8'))
const cssPath = resolve(root, 'src/app/globals.css')
let css = readFileSync(cssPath, 'utf8')

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildVarBlock(tokens) {
  return Object.entries(tokens)
    .filter(([key]) => !key.startsWith('_'))
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n')
}

function buildGlassBlock(glass) {
  const { panel, surface, chip, frame, blur, saturate } = glass
  return `
/* Glass utility classes */
@layer utilities {
  .glass-panel {
    backdrop-filter: blur(${blur.panel}) saturate(${saturate.panel});
    -webkit-backdrop-filter: blur(${blur.panel}) saturate(${saturate.panel});
    background: ${panel.light.background};
    border: 1px solid ${panel.light.border};
    box-shadow: ${panel.light.shadow};
  }

  .dark .glass-panel {
    background: ${panel.dark.background};
    border: 1px solid ${panel.dark.border};
    box-shadow: ${panel.dark.shadow};
  }

  .glass-surface {
    backdrop-filter: blur(${blur.surface}) saturate(${saturate.surface});
    -webkit-backdrop-filter: blur(${blur.surface}) saturate(${saturate.surface});
    background: ${surface.light.background};
    border: 1px solid ${surface.light.border};
    box-shadow: ${surface.light.shadow};
  }

  .dark .glass-surface {
    background: ${surface.dark.background};
    border: 1px solid ${surface.dark.border};
    box-shadow: ${surface.dark.shadow};
  }

  .glass-chip {
    backdrop-filter: blur(${blur.chip}) saturate(${saturate.chip});
    -webkit-backdrop-filter: blur(${blur.chip}) saturate(${saturate.chip});
    background: ${chip.light.background};
    border: 1px solid ${chip.light.border};
    box-shadow: ${chip.light.shadow};
  }

  .dark .glass-chip {
    background: ${chip.dark.background};
    border: 1px solid ${chip.dark.border};
    box-shadow: ${chip.dark.shadow};
  }

  /* Legacy aliases */
  .glass,
  .glass-card {
    backdrop-filter: blur(${blur.panel}) saturate(${saturate.panel});
    -webkit-backdrop-filter: blur(${blur.panel}) saturate(${saturate.panel});
    background: ${panel.light.background};
    border: 1px solid ${panel.light.border};
    box-shadow: ${panel.light.shadow};
  }

  .dark .glass,
  .dark .glass-card {
    background: ${panel.dark.background};
    border: 1px solid ${panel.dark.border};
    box-shadow: ${panel.dark.shadow};
  }

  .glass-subtle {
    backdrop-filter: blur(${blur.surface}) saturate(${saturate.surface});
    -webkit-backdrop-filter: blur(${blur.surface}) saturate(${saturate.surface});
    background: ${surface.light.background};
    border: 1px solid ${surface.light.border};
    box-shadow: ${surface.light.shadow};
  }

  .dark .glass-subtle {
    background: ${surface.dark.background};
    border: 1px solid ${surface.dark.border};
    box-shadow: ${surface.dark.shadow};
  }

  .glass-frame {
    background: ${frame.light.background};
    border: 1px solid ${frame.light.border};
    box-shadow: ${frame.light.shadow};
  }

  .dark .glass-frame {
    background: ${frame.dark.background};
    border: 1px solid ${frame.dark.border};
    box-shadow: ${frame.dark.shadow};
  }
}`
}

function buildScrollbarBlock(sb) {
  return `
/* Smooth scrollbar */
::-webkit-scrollbar {
  width: ${sb.width};
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: ${sb.thumb};
  border-radius: 99px;
}
::-webkit-scrollbar-thumb:hover {
  background: ${sb['thumb-hover']};
}`
}

// :root block
css = css.replace(
  /:root \{[\s\S]*?\}/,
  `:root {\n${buildVarBlock(ds.theme.light)}\n}`
)

// .dark block
css = css.replace(
  /\.dark \{[\s\S]*?\}/,
  `.dark {\n${buildVarBlock(ds.theme.dark)}\n}`
)

// Glass utilities block (from "/* Glass utility classes */" to closing "}")
css = css.replace(
  /\/\* Glass utility classes \*\/[\s\S]*?^}/m,
  buildGlassBlock(ds.glass).trimStart()
)

// Scrollbar block (from "/* Smooth scrollbar */" to end of file)
css = css.replace(
  /\/\* Smooth scrollbar \*\/[\s\S]*/,
  buildScrollbarBlock(ds.scrollbar).trimStart()
)

// ── Write ─────────────────────────────────────────────────────────────────────

writeFileSync(cssPath, css, 'utf8')
console.log('✓ design-system.json → src/app/globals.css')
console.log(`  light theme: ${Object.keys(ds.theme.light).filter(k => !k.startsWith('_')).length} tokens`)
console.log(`  dark theme:  ${Object.keys(ds.theme.dark).filter(k => !k.startsWith('_')).length} tokens`)
