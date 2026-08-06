# AVP² boundary (corrected)

**Status:** Accepted correction 2026-08-06  
**Canonical Opal expansion:** `Opal/docs/product/OPAL_AVP2_PAYMENTS_BOUNDARY.md`

---

## Scope

**AVP² governs payments and financial commitment only.**

It does **not** govern general Opal/device capabilities such as:

- location or ETA;
- calendar free/busy;
- calls or messages;
- navigation;
- invites or relationships;
- who may see private information;
- booking inquiry without money;
- whether a conversation becomes a plan.

Those belong to **Opal domain** and the **device capability system** (`device.capability.*` events), not AVP².

---

## What AVP² may authorize

- payment authorization and capture;
- deposits;
- shared / split payments;
- group contributions and reimbursements;
- subscription or membership payments;
- escrow or conditional release;
- refunds;
- payment proof and reconciliation;
- revocation before settlement where possible.

---

## Kafka

Kafka may carry payment-shaped events, for example:

```text
avp2.payment.requested
avp2.payment_terms.presented
avp2.payment.authorized
avp2.payment.declined
avp2.payment.captured
avp2.payment_split.requested
avp2.payment_split.completed
avp2.refund.requested
avp2.refund.completed
avp2.transaction.reconciled
```

**Deprecated as general capability events under AVP²:**

```text
avp2.permission.granted
avp2.permission.revoked
```

Do not use those names for location, calls, or device grants. Prefer `device.capability.granted` / `device.capability.revoked` (Opal-owned).

Kafka does **not** decide payment or permission. It transports events after authoritative decisions.

---

## Separation

| Layer | Role |
|-------|------|
| **AVP²** | Payment policy, authorization, settlement, proof |
| **Opal** | Social truth, experience state, human visibility |
| **Device capability system** | What Opal may do on the user’s device |
| **Foundation agent plane** | Route only work already authorized by the correct plane |
| **Kafka** | Durable transport after decisions |

---

## Agent rule

> AVP² = money. Not universal agent permissions.
