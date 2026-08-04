-- Foundation-owned projection store (Phase 1). Not Opal production.

CREATE TABLE IF NOT EXISTS audit_events (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  event_version INT NOT NULL,
  producer TEXT NOT NULL,
  topic_family TEXT NOT NULL,
  partition_key TEXT NOT NULL,
  privacy_class TEXT NOT NULL,
  purpose TEXT,
  correlation_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  envelope JSONB NOT NULL,
  kafka_topic TEXT,
  kafka_partition INT,
  kafka_offset BIGINT,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_events_type_idx ON audit_events (event_type);
CREATE INDEX IF NOT EXISTS audit_events_corr_idx ON audit_events (correlation_id);

CREATE TABLE IF NOT EXISTS relationship_acceptance_projection (
  invitation_id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consumer_offsets (
  consumer_group TEXT NOT NULL,
  topic TEXT NOT NULL,
  partition INT NOT NULL,
  last_offset BIGINT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (consumer_group, topic, partition)
);

CREATE TABLE IF NOT EXISTS dead_letters (
  id BIGSERIAL PRIMARY KEY,
  reason TEXT NOT NULL,
  raw_body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
