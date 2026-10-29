# flubber

A personal Claude Code skill, `/next-project`, that suggests varied learning projects based on your profile, a coverage map of CS/tech areas, past feedback, and fresh web research. See `PLAN.md` for the design.

## Layout
- `skill/` - the skill (`SKILL.md`, `rubric.md`, `research.md`, `taxonomy.json`, `templates/`, `scripts/`, `fixtures/`)
- `state/` - your profile, map, history and preferences (created on first run; never edit by hand)

## Install
The skill is installed as a junction so edits here are live:

    New-Item -ItemType Junction -Path "$HOME\.claude\skills\next-project" -Target "D:\flubber\skill"

Restart Claude Code (or start a new session), then run `/next-project`.

## Check state
    node skill\scripts\validate-state.mjs            # validates D:\flubber\state
    node skill\scripts\validate-state.mjs <dir>      # validate any state dir (e.g. skill\fixtures\mid-journey)

## Testing
No automated tests for idea quality. Use `skill/fixtures/mid-journey` as a sample state, run the skill several times, and check against `skill/rubric.md`: varied areas, all three tiers present, no repeats, sources cited, dislikes respected.
