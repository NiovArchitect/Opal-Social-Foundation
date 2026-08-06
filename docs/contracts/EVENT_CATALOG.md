# Event catalog (template)

| event_type | topic_family | partition_key | producer | privacy_class | consumers (examples) |
|------------|--------------|---------------|----------|---------------|----------------------|
| invitation.created | opal.invitation.events | invitation_id | opal_core | shared_authorized | audit, notifications |
| invitation.accepted | opal.invitation.events | invitation_id | opal_core | shared_authorized | audit, projections |
| relationship.accepted | opal.relationship.events | relationship_id | opal_core | shared_authorized | audit, agents (later) |
| conversation.opened | opal.conversation.events | conversation_id | opal_core | shared_authorized | projections |
| conversation.message.accepted | opal.conversation.events | conversation_id | opal_core | shared_authorized | analytics (minimized) |
| journey.possibility.created | opal.journey.events | journey_id | opal_core | shared_authorized | experience agents |
| reservation.requested | opal.reservation.events | reservation_id | foundation | internal | providers |
| reservation.confirmed | opal.reservation.events | reservation_id | foundation | shared_authorized | opal, audit, payments |
| payment.authorized | opal.payment.events | payment_id | foundation | restricted | audit, reconciliation |
| avp2.payment.requested | opal.avp2.authorization.events | payment_id | avp2 | restricted | foundation, audit |
| avp2.payment_terms.presented | opal.avp2.authorization.events | payment_id | avp2 | restricted | foundation, audit |
| avp2.payment.authorized | opal.avp2.authorization.events | payment_id | avp2 | restricted | foundation, audit, reconciliation |
| avp2.payment.declined | opal.avp2.authorization.events | payment_id | avp2 | restricted | foundation, audit |
| avp2.payment.captured | opal.avp2.authorization.events | payment_id | avp2 | restricted | foundation, audit, reconciliation |
| avp2.payment_split.requested | opal.avp2.authorization.events | payment_id | avp2 | restricted | foundation, audit |
| avp2.payment_split.completed | opal.avp2.authorization.events | payment_id | avp2 | restricted | foundation, audit, reconciliation |
| avp2.refund.requested | opal.avp2.authorization.events | payment_id | avp2 | restricted | foundation, audit |
| avp2.refund.completed | opal.avp2.authorization.events | payment_id | avp2 | restricted | foundation, audit |
| avp2.transaction.reconciled | opal.avp2.authorization.events | payment_id | avp2 | restricted | foundation, audit, reconciliation |
| provider.action.failed | opal.provider.results | request_id | foundation | internal | audit, retry |

**AVP² is payments only.** Do not add `avp2.permission.*` for device/location/calls.

Device capability events use a **different namespace** (Opal-owned; catalogued here for cross-repo clarity; not Foundation runtime):

```text
device.capability.granted
device.capability.revoked
device.action.requested
device.action.approved
device.action.completed
device.action.failed
```

See Opal `docs/product/OPAL_DEVICE_CAPABILITY_SYSTEM.md` and Foundation `docs/AVP2_BOUNDARY.md`.

Deprecated (do not implement as general capability grants under AVP²):

| event_type | note |
|------------|------|
| avp2.permission.granted | Incorrect general capability event; use `device.capability.*` / Opal domain |
| avp2.permission.revoked | Incorrect general capability event; use `device.capability.*` / Opal domain |

Expand only with schema ownership and version policy. No production Kafka connection or Opal runtime integration is implied by this catalog.
