# Agent Teams — Patterns, Lessons & Playbook

> Synthesized from the `wchat-ui-improvement` team run (2026-04-09).  
> Team: Researcher → Designer → Frontend Engineer (Sonnet, 3 agents)  
> Goal: Glassmorphism UI/UX improvement of a Next.js + Tailwind + shadcn app.

---

## 1. Team Composition Patterns

### Sequential Pipeline (used in this run)
Best for tasks with strict dependencies — each phase gates the next.

```
Researcher ──findings──▶ Designer ──design system──▶ Frontend
```

**When to use:** Research-then-build workflows where implementation quality depends on prior analysis. The risk of parallel start is wasted work (frontend builds the wrong thing).

**Key rule:** Only unblock the next agent when the previous one has *sent their findings*, not just when their task is "done". The message is the handoff.

### Parallel Swarm
All agents start simultaneously and coordinate via the shared task list.

**When to use:** Tasks that are genuinely independent from the start (e.g., reviewing 3 separate modules, writing 3 separate features).

### Hub and Spoke
One lead agent + multiple specialists reporting back, no peer-to-peer messaging.

**When to use:** When only the lead needs to synthesize — specialists don't need each other's context.

---

## 2. Role Design Patterns

### Separation of Concerns
Each agent had a single, well-defined output:
| Agent    | Input                        | Output                   | Must not do              |
|----------|------------------------------|--------------------------|--------------------------|
| Researcher | Codebase                   | `docs/research-report.md` | Modify source files      |
| Designer   | Research report            | `docs/design-system.md`  | Implement code           |
| Frontend   | Research + design system   | Updated UI + build notes | Redesign from scratch    |

**Anti-pattern:** Giving one agent too many roles (analyze + design + implement). Token cost explodes and quality degrades.

### Read-Only Researchers
Researchers and Designers should never modify source files. Enforce this in the spawn prompt explicitly: "DO NOT modify any source files." Violations cause downstream confusion about what the ground truth is.

### Frontend as Incremental Implementer
Framing the frontend agent with a "mini PR mindset" prevents rewrites. The prompt constraint "DO NOT rewrite the project" is load-bearing — without it, agents tend to over-engineer.

---

## 3. Spawn Prompt Patterns

### The Dependency Wait Pattern
When an agent must wait for another before starting, say so explicitly in the spawn prompt:

```
Do NOT start designing until you receive a message from `researcher` with their findings.
Simply wait — the message will arrive automatically.
```

Without this, agents start immediately and produce output based on nothing.

### Context Loading Instructions
Agents don't inherit the lead's conversation history. Include explicit read instructions:

```
Once the Designer messages you, read:
- /path/to/docs/design-system.md (full)
- /path/to/docs/research-report.md (full)
- All existing source files you'll be modifying
```

### Deliverable Anchoring
Always name the exact output file path in the prompt. Vague instructions ("write a report") produce inconsistently named or located files.

```
Write the full report to /Users/macbook/projets/wchat/docs/research-report.md
```

### Notification Contract
End every agent prompt with an explicit notification instruction:

```
When done, send a message to team-lead saying your task is complete
and the report is ready at docs/research-report.md
```

Without this, the lead has no reliable signal that the agent finished.

---

## 4. Communication Patterns

### Findings Broadcast (Researcher → Multiple)
When one agent's output is needed by multiple downstream agents, have them send directly to each:

```
- Send findings to `designer` with: UI/UX issues + glassmorphism readiness
- Send findings to `frontend` with: component inventory + performance observations
```

This lets each recipient get a tailored summary rather than having everyone read the same raw report.

### Design Sign-Off Gate
The Designer explicitly validates their own output before notifying Frontend:

```
Review the design system for internal consistency before notifying Frontend.
Frontend cannot start without your sign-off.
```

This prevents cascading errors where a flawed design system gets implemented before anyone catches the problem.

### Lead as Traffic Controller
The lead (this session) does not do domain work — it spawns, monitors, resolves blockers, and synthesizes. Keep the lead's prompt light and focused on coordination, not implementation.

---

## 5. Permission & Tool Patterns

### Avoid Bash in Researcher Agents
Bash commands trigger permission prompts that bubble up to the user/lead and block progress. For read-only analysis agents, enforce tool restrictions in the prompt:

```
Use only Read, Glob, and Grep tools. Do not use Bash.
```

**Why:** Read/Glob/Grep have no permission prompts. Bash does. In a pipeline where the researcher blocks everything downstream, a permission hang is a team-wide stall.

### Pre-approve Bash for Frontend Agents
If the Frontend agent needs to run `npm run dev` or similar, pre-approve it in `.claude/settings.local.json` before spawning:

```json
{
  "permissions": {
    "allow": ["Bash(npm run:*)", "Bash(npm install:*)"]
  }
}
```

### Permission Bubbling
When a teammate hits a permission prompt, it surfaces to the lead as a `permission_request` message. The lead cannot approve it via `SendMessage` — it surfaces to the **user**. Design around this: either pre-approve, or redirect the agent to use non-Bash tools.

---

## 6. Task Design Patterns

### 5–6 Tasks per Agent
Keep each agent productive without context thrashing. For a 3-agent team doing UI work, a good breakdown is:

```
Researcher:  5 tasks (structure, components, tailwind, issues, glassmorphism readiness)
Designer:    6 tasks (glass system, colors, layout, typography, components, animations)
Frontend:    6 tasks (tailwind config, CSS vars, GlassCard, navbar, sidebar, page)
```

### Dependency Encoding
Mark tasks that depend on other tasks as blocked until the prerequisite is complete. This prevents agents from claiming work they can't yet do.

### Task Sizing
- **Too small:** "read globals.css" — overhead dominates
- **Too large:** "implement the entire design system" — no checkpoints, high risk of drift
- **Right size:** "implement GlassCard component and apply it to the sidebar"

---

## 7. Anti-Patterns Observed

| Anti-pattern | What happened | Fix |
|---|---|---|
| Agent uses Bash for exploration | Researcher triggered a permission prompt, stalling the pipeline | Restrict to Read/Glob/Grep in spawn prompt |
| Agents start without waiting | Designer and Frontend went idle immediately waiting — correct behavior, but only because the prompt was explicit | Always include the dependency wait instruction |
| No explicit output path | Can lead to files written to wrong locations or not at all | Always specify the exact absolute path |
| Missing notification contract | Agent finishes but lead doesn't know | End every prompt with "send team-lead a completion message" |
| Overloaded agent role | One agent doing research + design + implementation | Split into dedicated roles with clean boundaries |
| Implicit file ownership | Two agents editing the same file | Give each agent exclusive file ownership, document it in the prompt |

---

## 8. Token Cost Management

- Each teammate has its own context window — costs scale linearly with team size
- **3 agents** is the sweet spot for sequential pipelines
- Researchers and Designers cost less (no code generation) — use cheaper models if needed
- The Frontend agent does the heaviest work — give it the most capable model (Sonnet or Opus)
- Broadcast (`"*"`) messages cost linearly — use only when everyone genuinely needs it
- Keep spawn prompts focused — bloated prompts inflate every turn's token cost

---

## 9. Cleanup Protocol

Always shut down teammates before calling `TeamDelete`:

```
1. Send shutdown_request to each teammate
2. Wait for shutdown_response with approve: true
3. Call TeamDelete
```

**Never** call `TeamDelete` with active teammates — it leaves resources in an inconsistent state. Always clean up via the lead, not a teammate.

---

## 10. Quick Reference — Spawn Prompt Checklist

For every agent spawn prompt, verify it includes:

- [ ] Role definition and purpose
- [ ] Working directory
- [ ] Explicit dependency wait instruction (if applicable)
- [ ] List of files/docs to read as context
- [ ] Tool restrictions (Read/Glob/Grep only for researchers)
- [ ] Exact output file path(s)
- [ ] DO NOT constraints (no source edits, no rewrites, no heavy deps)
- [ ] Notification contract (message team-lead when done)
- [ ] Team config path for peer discovery (`~/.claude/teams/{team-name}/config.json`)

---

## 11. Model Selection by Role

| Role | Recommended Model | Reasoning |
|---|---|---|
| Researcher | Sonnet | Needs broad reading + synthesis, not code generation |
| Designer | Sonnet | Needs creative + structured reasoning |
| Frontend | Sonnet or Opus | Implements code — quality matters most here |
| Lead (coordinator) | Sonnet | Orchestration only, no heavy domain work |

---

## 12. Reusable Team Templates

### UI Improvement Team (this pattern)
```
Lead: coordinator
├── Researcher (Sonnet, read-only)    → docs/research-report.md
├── Designer (Sonnet, read-only)      → docs/design-system.md
└── Frontend (Sonnet, full access)    → src/ changes + docs/build-summary.md
```

### Parallel Code Review Team
```
Lead: coordinator
├── Reviewer-Security (Sonnet)        → security findings
├── Reviewer-Performance (Sonnet)     → performance findings
└── Reviewer-Tests (Sonnet)           → test coverage findings
```

### Competing Hypotheses Debug Team
```
Lead: coordinator
├── Investigator-A (Sonnet)           → hypothesis A
├── Investigator-B (Sonnet)           → hypothesis B
├── Investigator-C (Sonnet)           → hypothesis C
└── Investigator-D (Sonnet)           → hypothesis D
(agents debate each other's findings via SendMessage)
```

### Feature Build Team
```
Lead: coordinator
├── Backend (Sonnet)                  → API + data layer
├── Frontend (Sonnet)                 → UI components
└── QA (Sonnet, read-only)            → test plan + validation notes
```
