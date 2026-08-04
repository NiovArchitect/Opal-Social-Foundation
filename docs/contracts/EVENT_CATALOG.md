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
| avp2.permission.granted | opal.avp2.authorization.events | agent_id | avp2 | internal | foundation agent plane |
| avp2.permission.revoked | opal.avp2.authorization.events | agent_id | avp2 | internal | foundation agent plane |
| provider.action.failed | opal.provider.results | request_id | foundation | internal | audit, retry |

Expand only with schema ownership and version policy.
