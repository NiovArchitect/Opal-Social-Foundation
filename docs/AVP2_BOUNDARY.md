# AVP² boundary

AVP² governs **who may act** and **what capabilities are allowed**.

Kafka may carry:

- `avp2.permission.granted`
- `avp2.permission.revoked`
- authorized requests, offers, confirmations, expirations

Kafka does **not** decide permission.

## Separation

| Layer | Role |
|-------|------|
| AVP² | policy and capability grants |
| Foundation agent plane | route only authorized work |
| Opal | social truth and human visibility |
