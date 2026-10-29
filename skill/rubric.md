# Idea quality rubric

Used when generating ideas and by the critic pass. An idea must pass every **hard** criterion; **soft** criteria are used to rank.

## Hard (reject if any fails)
1. **Not CRUD.** The core challenge is not forms, REST endpoints and a database over a standard framework. A web UI is fine as a thin layer.
2. **Beyond "intro to X".** Meaningfully harder than a beginner tutorial; has at least one non-trivial technical problem the user must understand (e.g. a protocol, an algorithm, concurrency, a data structure, numerical method).
3. **Named concept.** The learning goal is stated as a concrete concept or skill, not "get better at Rust".
4. **Demoable end state.** There is a clear "done" the user can run, show or benchmark, and publish on public GitHub as evidence of skill.
5. **Explainable with LLM help.** Someone with the user's profile can understand the AI-written code by asking questions. No area that needs a graduate degree to follow.
6. **Fits the time tier** realistically for a few hours a week.
7. **Sustainable tooling.** Key libraries/tools are maintained and free to use (verified, or flagged as unverified).
8. **Fresh.** Not a repeat or near-duplicate of a past suggestion; respects recorded dislikes and hard no's.

## Soft (rank by)
- Fills an `untouched` or `shallow` area on the map.
- Connects to a stated interest (games, fitness, food, science, music, hardware, philosophy...).
- Uses AI in the project itself or in the build workflow in an instructive way.
- Surprising: the user would not have thought of it themselves.
- Idiomatic language choice with an interesting alternative.
- Has a stretch goal for extra time.

## Anti-patterns to avoid
URL shorteners, todo apps, generic chatbots, "wrapper around an API", yet another tracker, blog engines, anything that is mostly gluing a framework template.
