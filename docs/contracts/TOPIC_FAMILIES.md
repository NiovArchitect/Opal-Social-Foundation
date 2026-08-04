# Topic families (planned)

```text
opal.identity.events
opal.relationship.events
opal.conversation.events
opal.journey.events
opal.experience.events
opal.memory.events
opal.invitation.events
opal.safety.events
opal.provider.requests
opal.provider.results
opal.reservation.events
opal.payment.events
opal.avp2.authorization.events
opal.audit.events
```

Do not start with one giant `opal-events` topic.

Partition keys preserve ordering where it matters (conversation, journey, relationship, reservation IDs). Global ordering is not required.
