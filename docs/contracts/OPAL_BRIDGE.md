# Opal → Foundation bridge

## Current Opal side

- Transactional PostgreSQL `event_outbox`
- Versioned envelopes
- Oban publisher
- LocalAdapter (PubSub + log)
- `OPAL_KAFKA_ENABLED` off

The outbox is the **bridge**, not the foundation.

## Future boundary

```text
Opal authority transaction
  +--> social truth in Opal PostgreSQL
  +--> outbox row (minimal IDs)
           |
           v
    Foundation ingest API / Kafka produce
           |
           +--> agents
           +--> providers
           +--> audit
           +--> payments
           +--> projections
           |
           v (results only)
    Opal validates and may update human-facing state
           |
           v
    Phoenix Channel → user
```

## Rules

- Foundation never writes Opal conversations directly
- Results re-enter Opal as proposals/confirmations for Elixir validation
- Privacy classification enforced before produce
