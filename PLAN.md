# Plan: `/next-project` skill

A personal Claude Code skill that suggests varied, learning-focused coding projects based on who you are, what you've already built, and what's currently worth learning.

## 1. Scope

**v1 (in)**
- Personal Claude Code skill `/next-project`; state lives in markdown/YAML files the user never hand-edits.
- First-run calibration interview builds the profile and places the user on the coverage map.
- **Research phase on every suggest run** (web search): what's trending, which tools/libraries are maintained and free, what similar projects already exist. Findings feed idea generation and are cited in each idea.
- Each run proposes ~6 varied ideas across 3 time tiers (~1-2, 3-5, 6-8 weeks). Each has a named learning goal, a "done" definition, and language options with trade-offs.
- Quality rubric plus a critic pass that filters weak or generic ideas.
- Guided feedback: reactions to each batch, and a short retro when a project finishes or is abandoned. Preferences are learned from these.
- On pick, scaffold `D:\<slug>\` with `git init` and a `CLAUDE.md` containing the full project brief.

**Later**
- Stats and progress views, "revisit this area" nudges, a real CLI if the skill hits its limits, tuning idea count.

**Out**
- Any app, UI or database; API-billed usage; hosting/CI for scaffolded projects.

**Defaults assumed**
- ~6 ideas per run (adjustable later); no hard "no"s initially (learned from dislikes).

## 2. Key flows

1. **First run:** 5-8 question interview (experience, interests, time, language appetite) writes the profile and seeds the map.
2. **Suggest run:**
   1. If the last picked project has no retro, ask for it first.
   2. Read profile, map, history, preferences.
   3. **Research:** web-search current trends, maintained tooling, existing similar projects, and anything relevant to the user's interests and gap areas.
   4. Draft candidates grounded in the research; run the critic against the rubric.
   5. Present ~6 ideas with sources; user picks one or asks for more.
3. **Scaffold:** create `D:\<slug>\` with `CLAUDE.md` (brief, learning goals, done criteria, chosen language, milestones, working agreement to review AI-written code) and `git init`.
4. **Retro:** guided questions (learned, difficulty, enjoyment, finished?) update the map and preferences.

## 3. Architecture and stack

- **No code app.** A skill is a folder with a `SKILL.md`; personal skills in `~/.claude/skills/` work across all projects ([guide](https://www.analyticsvidhya.com/blog/2026/10/claude-code-custom-commands-skills-automate-your-workflow/), [Educative](https://www.educative.io/courses/claude-code/custom-commands-and-skills)).
- **Layout**
  - Skill source: `D:\flubber\skill\`, installed to `~/.claude/skills/next-project` via junction or copy.
  - State: `D:\flubber\state\` (separate from the skill so updates never touch history); private git repo gives history/backup.
  - Skill reads/writes state by absolute path.
- **Taxonomy:** seeded from [Teach Yourself CS](https://teachyourselfcs.com/) (nine subjects: programming, computer architecture, algorithms/data structures, math for CS, operating systems, networking, databases, languages/compilers, distributed systems; list from memory, verify at build time) plus AI/ML and agents, embedded/hardware, graphics/games, security, scientific computing.
- **Trade-off:** free and fast, but a skill can't enforce behaviour (skipped retros) and models drift towards generic output. Mitigated by rubric, critic pass, research grounding, and retro-first ordering.

## 4. Data model (in `state\`)

- `profile.md`: background, interests, weekly time, language comfort.
- `map.json`: per area, level (`untouched` / `shallow` / `solid`), last-touched date, linked projects.
- `history.json`: per suggestion: id, date, title, tier, tags, areas, languages offered, reaction (`picked` / `liked` / `disliked` / `skipped`), reason, sources used; for picked: status, repo path, retro notes.
- `preferences.md`: distilled likes/dislikes, rewritten every few runs to keep context small.
- `rubric.md`: quality criteria for generation and critic.
- `research-notes.md` (optional cache): recent findings with dates, so repeat runs don't redo everything and stale entries expire.

## 5. Components

| Component | Role |
|---|---|
| `SKILL.md` | Orchestration steps and flow |
| `research.md` | Research phase instructions: queries to run, what to verify (maintained, free, current), citation rules |
| `rubric.md` | Non-CRUD, named concept, demoable end, understandable with LLM help, GitHub-worthy |
| `taxonomy.json` | Seed areas and descriptions |
| `templates/CLAUDE.project.md` | Scaffolded brief template |
| `scripts/validate-state` | Optional check that state files stay well-formed |

Data flow: state + research -> generation -> critic -> user; reactions/retros -> state.

## 6. Risks and de-risking

| Risk | Mitigation |
|---|---|
| Skill can't read/write `D:\` reliably | Phase 0 spike |
| Ideas are generic | Research grounding, rubric, critic pass, forced spread across areas/tiers, tracked dislikes |
| Research is slow/costly or returns thin results | Cap queries per run, cache notes, fall back to standard mode first and extended only when thin |
| Research sources are low quality (vendor blogs) | Require verification of tool status (maintained, license, cost) and label opinion vs verified |
| Feedback skipped | Retro asked at start of next run |
| State bloat | `preferences.md` summary; load only recent history |
| Over-building tooling | Small phases, each must prove itself first |

## 7. Phased build order

Each phase is shippable, ~1-3 evenings.
0. **Spike:** minimal `SKILL.md` reads a stub profile, returns 3 ideas, writes one history entry. Works from any directory.
1. **Onboarding and map:** interview, `profile.md`, `map.json`, taxonomy.
2. **Research phase:** `research.md`, web search integration, citations, caching; ideas grounded in findings.
3. **Quality suggest:** rubric, critic pass, tiers, language options, ~6 ideas. Test by running ten times and checking spread.
4. **Feedback loop:** reactions, retro, map updates, preferences summary.
5. **Scaffold:** `D:\<slug>` repo + `CLAUDE.md`.
6. **Polish:** anti-repetition, validate script, README.

## 8. Testing and deployment

- **Testing:** fixture states (new user, mid-journey, many dislikes) with checklists: rubric met, no repeats, tiers present, dislikes respected, sources cited. Manual review for "interesting". Validate script for file shape.
- **Deployment:** copy/junction into `~/.claude/skills/`. No hosting.
