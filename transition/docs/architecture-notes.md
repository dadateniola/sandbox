# Transition Engine V2 Notes

This folder stores internal notes for contributors who are reading engine code directly.

Key rule:
- Engine decides state.
- Orchestrators decide when to run transitions.
- Registry decides how transitions run.
- Adapters decide where targets come from.
- Components decide what to render.

When debugging:
1. Open the in-app Transition Debug panel.
2. Verify request kind/type and phase progression.
3. Inspect DOM targets using data-transition-role attributes.
4. Confirm registered transition key exists.
