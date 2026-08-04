# First Phase 1 slice (proposal only)

## Name

Foundation Ingest of Opal Invitation and Relationship Events

## Goal

Accept Opal outbox-published `invitation.*` and `relationship.accepted` envelopes into foundation-owned storage and optional local Kafka (dev only), with audit projection.

## Non-goals

- No agent execution
- No payments
- No production Opal coupling beyond signed ingest contract
- No user UI

## Exit criteria

- Contract tests green
- Idempotent ingest
- Privacy validation rejects forbidden payloads
- Replay of synthetic fixtures rebuilds audit projection
