# Opal Social Foundation

**Provisional name.** Final public brand requires founder approval.

Phase 0: architecture, contracts, isolation, and CI only.  
**No production traffic. No production Kafka. No production Opal data. No secrets.**

## What this is

The durable nervous system for events, agents, providers, authorization, transactions, replay, and proof — designed first for **Opal** (social communication and experience collaboration), and capable of serving other Niov Labs products later.

## What this is not

- Not Opal (human product authority remains in `NiovArchitect/Opal`)
- Not a folder or submodule of Opal
- Not a clone or fork of `niov-foundation` by default
- Not an operational Kafka cluster in Phase 0
- Not a replacement for Phoenix, Elixir, or BEAM social truth

## Relationship to Opal

| System | Owns |
|--------|------|
| **Opal** | Identity, sessions, relationships, invitations, conversations, journeys, consent, youth, human-facing state |
| **Opal Social Foundation** | Event streaming, agent registry, provider integration, execution orchestration, cross-system audit, projection rebuild, schema governance, replay tooling |

Opal’s transactional **outbox** is the *bridge* into the foundation. The outbox is not the foundation.

## Relationship to original Foundation (`niov-foundation`)

Source of lessons only. See [docs/ORIGINAL_FOUNDATION_ASSESSMENT.md](docs/ORIGINAL_FOUNDATION_ASSESSMENT.md).

## Planes

See [docs/planes/OVERVIEW.md](docs/planes/OVERVIEW.md).

## Phase 0 scope

- Repository isolation
- Product truth and authority boundaries
- Event catalog and envelope contracts
- Kafka role and activation criteria
- Agent and AVP² boundaries
- Security and privacy models
- CI harness
- First Phase 1 slice proposal

## Local development

Phase 0 has no runtime dependencies. Install nothing paid.

```bash
# Validate markdown and JSON contracts later as tooling lands.
npm test   # contract smoke tests when present
```

## License / confidentiality

Private repository. No production credentials. No customer data.
