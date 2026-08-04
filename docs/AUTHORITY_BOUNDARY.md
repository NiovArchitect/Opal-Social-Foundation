# Authority boundary: Opal vs Foundation

## Opal remains authoritative for

- human identity
- sessions and devices
- relationships and invitations
- conversations and message acceptance
- personal nuance visibility
- journey truth and participation
- shared plans
- private vs shared audience
- user consent
- blocking
- youth policy
- human-facing state

## Foundation may own

- event streaming (Kafka plane)
- agent identity and capability registry
- request routing, timeouts, retries, cancellation
- provider connectors and result normalization
- external feed ingestion
- execution orchestration (holds, payments, refunds) as *service*, not social truth
- cross-system audit and proof
- projection rebuilding from permitted events
- event schema governance and replay tooling
- AVP² integration boundaries

## Hard rule

The foundation **must not** reach into Opal’s database and invent social truth.

It receives **explicit** events and requests through governed contracts.

Opal decides whether a relationship, conversation, or journey state is real for humans.
