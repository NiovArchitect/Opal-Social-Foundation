# Agent model

## Principles

- Agents do not scrape private human conversations
- Agents act only under AVP²-authorized capability and purpose
- Agents return structured results to the foundation
- Opal decides what humans see

## Capability template

See `templates/agents/capability.template.json`.

## Lifecycle

register → authorize (AVP²) → request → timeout/retry → result → audit → revoke
