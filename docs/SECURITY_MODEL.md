# Security model (Phase 0)

- No production secrets in repo
- No production Opal connection
- Least privilege for future service identities
- mTLS / signed service identity planned for Phase 1+
- Envelope integrity and schema validation before consume
- Dead-letter for poison messages
- Explicit allowlists for consumers per topic family
