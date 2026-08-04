/** Topic naming for Phase 1 (Kafka-compatible). */

export const TOPICS = {
  invitation: "opal.invitation.events",
  relationship: "opal.relationship.events",
  deadLetter: "opal.foundation.deadletter",
};

export function topicForEventType(eventType) {
  if (eventType.startsWith("invitation.")) return TOPICS.invitation;
  if (eventType.startsWith("relationship.")) return TOPICS.relationship;
  return TOPICS.deadLetter;
}

export const KAFKA_BROKERS = (
  process.env.OSF_KAFKA_BROKERS || "127.0.0.1:19092"
).split(",");

export const PG_URL =
  process.env.OSF_DATABASE_URL ||
  "postgres://osf:osf_dev_only@127.0.0.1:55432/osf_phase1";
