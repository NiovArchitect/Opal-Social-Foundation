# ADR 0001: Kafka role in Opal Social Foundation

## Status

Accepted for Phase 0 direction. **Not operationally deployed.**

## Decision

Kafka (or a compatible durable log) is a **first-class foundation component** for system-to-system events.

It does **not**:

- replace Phoenix (user realtime edge in Opal)
- replace Elixir/BEAM social authority in Opal
- create relationship or conversation truth

## Why

- Independent consumers (agents, payments, audit, analytics, AVP²)
- Resume after outages via offsets
- Replay for projection rebuild under privacy rules
- Fan-out without Opal calling every downstream system

## Phase 0 comparison (no vendor selection yet)

| Option | Notes |
|--------|--------|
| Apache Kafka | Industry standard; operational weight |
| Managed Kafka | Faster ops if activation criteria met |
| Redpanda | Kafka API compatible; evaluate later |
| Local lightweight | Dev only (e.g. single-node / docker compose later) |

## Activation

Requires explicit Phase 1+ operator decision. See event activation criteria shared with Opal’s outbox ADR.

## Relationship to Opal outbox

```text
Opal domain transaction
  -> PostgreSQL authority
  -> Opal event_outbox
  -> publisher
       -> LocalAdapter (current Opal)
       -> Foundation ingest (future Phase 1+)
            -> Kafka topics
```
