# Event envelope (foundation contract)

Compatible with Opal’s `OpalCore.Events.DomainEvent` shape so the outbox can bridge cleanly.

```json
{
  "event_id": "evt_98f21",
  "event_type": "reservation.confirmed",
  "event_version": 1,
  "occurred_at": "2026-08-04T02:18:00Z",
  "recorded_at": "2026-08-04T02:18:01Z",
  "producer": "opal_core",
  "aggregate_type": "experience_journey",
  "aggregate_id": "journey_123",
  "sequence": 17,
  "correlation_id": "corr_456",
  "causation_id": "evt_previous",
  "tenant_scope": "opal",
  "relationship_scope": "rel_789",
  "privacy_class": "shared_authorized",
  "purpose": "reservation_coordination",
  "trace_context": {},
  "topic_family": "opal.reservation.events",
  "partition_key": "res_321",
  "payload": {
    "reservation_id": "res_321",
    "provider_reference": "provider_ref_654",
    "status": "confirmed"
  }
}
```

## Privacy classes

`public` | `internal` | `shared_authorized` | `private_authorized` | `restricted` | `prohibited_in_stream`

## Forbidden in general topics

Raw private messages, contact lists, phone numbers, precise locations, gift surprises, private guidance, session tokens, payment credentials, youth private content, unapproved personal nuance.
