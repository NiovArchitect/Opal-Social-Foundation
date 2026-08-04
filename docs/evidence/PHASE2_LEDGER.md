# Phase 2 evidence ledger

## Objective

Development bridge from Opal-shaped outbox envelopes to foundation ingress (not production Opal).

## Path

```text
Opal DomainEvent / outbox envelope (v1)
        |
        v  (dev only: OPAL_FOUNDATION_INGRESS_URL or bridge script)
Foundation ingress /v1/events
        |
        v privacy + allowlist
Redpanda topics
        |
        v
audit consumer + projection + replay (Phase 1)
```

## Opal side (when enabled)

- `FoundationHttpAdapter` POSTs to foundation
- Enabled only if `OPAL_FOUNDATION_INGRESS_URL` is set
- Default hosted Opal: **disabled**
- `mix opal.export_outbox` for offline export to foundation script

## Foundation side

- `npm run bridge:opal-shaped` — synthetic opal_core producer fixtures
- Compatibility matrix: `docs/contracts/OPAL_ENVELOPE_COMPATIBILITY.md`

## Evidence (this session)

| Check | Result |
|-------|--------|
| Unit tests (`test/*.test.mjs`) | 4 pass |
| Contract validate | pass |
| Ingress health | `{"ok":true,"ready":true,"service":"osf-ingress"}` |
| `npm run phase2:smoke` (synthetic opal_core fixtures) | 202 + 202 + poison 422; exit 0 |
| Production Opal → foundation | **not connected** (correct) |
| Live Kafka outside local Redpanda | **none** |

Topology remains local Phase 1: Redpanda + foundation PG + ingress :4100 + audit consumer path.

## Not done / not claimed

- Production bridge
- Live Render → foundation
- Message bodies in stream
- Agents / payments / AVP² execution
- Exactly-once delivery (at-least-once + idempotent event_id only)
