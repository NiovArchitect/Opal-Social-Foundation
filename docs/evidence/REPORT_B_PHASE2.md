# REPORT B — OPAL SOCIAL FOUNDATION PHASE 2

**Date:** 2026-08-03  
**Track:** B only  
**Repository:** https://github.com/NiovArchitect/Opal-Social-Foundation  
**Phase 1 HEAD (prior):** `5f5d06f` / Phase 1 feature `7ec92c4`  
**This work:** Phase 2 development outbox bridge artifacts (local only)  

## Status

**FOUNDATION PHASE 2 DEVELOPMENT BRIDGE PROVEN LOCALLY** (synthetic / Opal-shaped fixtures)

Not production. Not live Opal. Not a Social Flow 18 dependency.

## Objective completed

Connect **Opal-shaped** outbox envelopes to foundation **HTTP ingress** as the governance boundary, then re-use Phase 1 Redpanda → audit projection path.

```text
Opal DomainEvent / outbox envelope (v1)
        |
        v  dev only: OPAL_FOUNDATION_INGRESS_URL or bridge script
Foundation ingress /v1/events
        |
        v privacy + allowlist
Redpanda (local) topics
        |
        v
audit consumer + projection + replay (Phase 1)
```

## Deliverables

### Foundation repo

| Artifact | Role |
|----------|------|
| `scripts/bridge-from-opal-outbox.mjs` | POST Opal-shaped envelopes to ingress |
| `docs/contracts/OPAL_ENVELOPE_COMPATIBILITY.md` | Field matrix Opal ↔ foundation |
| `docs/evidence/PHASE2_LEDGER.md` | Path, evidence, non-claims |
| `package.json` scripts `bridge:opal-shaped`, `phase2:smoke` | Operator entrypoints |
| Test discovery fix | `node --test test/*.test.mjs` (Node 24) |

### Opal repo (dev bridge only; separate commit)

| Artifact | Role |
|----------|------|
| `FoundationHttpAdapter` | HTTP POST when `OPAL_FOUNDATION_INGRESS_URL` set |
| `PublishOutboxWorker` | LocalAdapter always; foundation optional |
| `mix opal.export_outbox` | Offline export for foundation script |
| `docs/architecture/FOUNDATION_EVENT_COMPATIBILITY.md` | Opal-side matrix |

## Evidence this session

| Check | Result |
|-------|--------|
| Unit tests | 4 pass |
| Contract validation | pass |
| Ingress health | ready (`osf-ingress`) |
| Local topology | `osf-postgres`, `osf-redpanda` healthy |
| `npm run phase2:smoke` | invitation 202, relationship 202, poison 422, exit 0 |
| Opal `FoundationAdapterTest` | 2 pass (disabled by default; enabled when URL set) |

## Authority boundary (unchanged)

| Opal owns | Foundation owns |
|-----------|-----------------|
| Identity, relationships, permissions | Durable transport |
| Social truth | Schema + privacy validation |
| Whether AI may reveal knowledge | Independent audit projections, replay |

Foundation does **not** decide who may read Grandma’s recipe.

## Explicit non-claims

- No production Opal traffic to foundation  
- No production Kafka  
- No Opal → Redpanda direct from domain code  
- No private conversation bodies on the stream  
- No agents, payments, or AVP² runtime  
- Not a submodule or fork of the original Foundation monorepo  
- Not required to close Social Flow 18  
- Not “production integration”  

## Next Phase 2 hardening (optional)

1. Local-only: enable `OPAL_FOUNDATION_INGRESS_URL=http://127.0.0.1:4100` against isolated Opal dev DB outbox rows  
2. `mix opal.export_outbox` → `OPAL_OUTBOX_EXPORT=... npm run bridge:opal-shaped`  
3. Confirm audit projection rows and replay offsets for exported event_ids  
4. Keep hosted Render free of foundation URL  

## Conclusion (Track B only)

**Phase 2 development bridge path is real and isolated.**  
**Production coupling remains forbidden.**
