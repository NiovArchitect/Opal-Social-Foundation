# Phase 1 evidence ledger

## Topology

```text
fixtures (synthetic Opal envelopes)
        |
        v
foundation ingress (:4100)
  schema + privacy firewall
        |
        v
Redpanda Kafka-compatible (localhost:19092)
  topics: opal.invitation.events, opal.relationship.events
        |
        v
audit consumer group osf-audit-v1
        |
        v
PostgreSQL foundation store (:55432)
  audit_events
  relationship_acceptance_projection
  dead_letters
  consumer_offsets
```

## Runtime choice

**Redpanda** for local Kafka protocol compatibility (dev-container mode).  
Not a production vendor selection.

## Proven capabilities (local)

- Ingress validation
- Privacy reject of phone payloads
- Produce to topic with partition key
- Independent audit consumer
- Idempotent audit on `event_id`
- Projection of invitation/relationship acceptance
- Replay rebuild of projection from audit store
- Dead-letter table for invalid payloads at consumer

## Explicit non-claims

- Not connected to production Opal
- Not connected to hosted Opal database
- Not AVP² runtime
- Not payments / agents / providers
