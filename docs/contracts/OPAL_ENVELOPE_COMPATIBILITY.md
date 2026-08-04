# Field compatibility: Opal DomainEvent v1 ↔ Foundation Phase 1

| Field | Opal | Foundation | Required | Compatible |
|-------|------|------------|----------|------------|
| event_id | string | string | yes | yes |
| event_type | string | allowlist | yes | yes for invitation/relationship.accepted |
| event_version | int | int | yes | yes |
| occurred_at | ISO string | string | yes | yes |
| recorded_at | ISO string | string | yes | yes |
| producer | opal_core | string | yes | yes |
| aggregate_type | string? | optional | no | yes |
| aggregate_id | string? | optional | no | yes |
| sequence | int? | optional | no | yes (Foundation may later alias aggregate_sequence) |
| correlation_id | string? | optional | no | yes |
| causation_id | string? | optional | no | yes |
| tenant_scope | string | optional | no | yes |
| relationship_scope | string? | optional | no | yes |
| privacy_class | string | enum | yes | yes if streamable |
| purpose | string? | optional | no | yes |
| topic_family | string | string | yes | yes |
| partition_key | string | string | yes | yes |
| payload | map | object | yes | yes if no forbidden keys |

## Phase 2 bridge rule

Opal → Foundation HTTP ingress only (when `OPAL_FOUNDATION_INGRESS_URL` set).  
Never Opal → Redpanda direct from domain code.
