/**
 * Audit consumer group — independent projection from Kafka topic.
 * Idempotent on event_id. Resumes via Kafka consumer group offsets.
 */

import { Kafka, logLevel } from "kafkajs";
import pg from "pg";
import { validateEnvelopeForStream } from "../lib/privacy.mjs";
import { KAFKA_BROKERS, PG_URL, TOPICS } from "../lib/topics.mjs";

const GROUP = process.env.OSF_CONSUMER_GROUP || "osf-audit-v1";
const TOPICS_IN = [TOPICS.invitation, TOPICS.relationship];

const kafka = new Kafka({
  clientId: "osf-audit-consumer",
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.ERROR,
});

const pool = new pg.Pool({ connectionString: PG_URL });

async function deadLetter(reason, raw) {
  await pool.query(
    `INSERT INTO dead_letters (reason, raw_body) VALUES ($1, $2)`,
    [reason, raw.slice(0, 8000)],
  );
}

async function project(envelope, meta) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO audit_events (
        event_id, event_type, event_version, producer, topic_family, partition_key,
        privacy_class, purpose, correlation_id, payload, envelope,
        kafka_topic, kafka_partition, kafka_offset
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (event_id) DO NOTHING`,
      [
        envelope.event_id,
        envelope.event_type,
        envelope.event_version,
        envelope.producer,
        envelope.topic_family,
        envelope.partition_key,
        envelope.privacy_class,
        envelope.purpose || null,
        envelope.correlation_id || null,
        JSON.stringify(envelope.payload || {}),
        JSON.stringify(envelope),
        meta.topic,
        meta.partition,
        Number(meta.offset),
      ],
    );

    if (
      envelope.event_type === "invitation.accepted" ||
      envelope.event_type === "relationship.accepted"
    ) {
      const invitationId =
        envelope.payload.invitation_id || envelope.aggregate_id;
      const relationshipId = envelope.payload.relationship_id;
      if (invitationId && relationshipId) {
        await client.query(
          `INSERT INTO relationship_acceptance_projection (
            invitation_id, relationship_id, event_id, accepted_at, updated_at
          ) VALUES ($1,$2,$3,$4,NOW())
          ON CONFLICT (invitation_id) DO UPDATE SET
            relationship_id = EXCLUDED.relationship_id,
            event_id = EXCLUDED.event_id,
            accepted_at = EXCLUDED.accepted_at,
            updated_at = NOW()`,
          [
            invitationId,
            relationshipId,
            envelope.event_id,
            envelope.occurred_at || new Date().toISOString(),
          ],
        );
      }
    }

    await client.query(
      `INSERT INTO consumer_offsets (consumer_group, topic, partition, last_offset, updated_at)
       VALUES ($1,$2,$3,$4,NOW())
       ON CONFLICT (consumer_group, topic, partition) DO UPDATE SET
         last_offset = EXCLUDED.last_offset,
         updated_at = NOW()`,
      [GROUP, meta.topic, meta.partition, Number(meta.offset)],
    );

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function run() {
  const consumer = kafka.consumer({ groupId: GROUP });
  await consumer.connect();
  for (const t of TOPICS_IN) {
    await consumer.subscribe({ topic: t, fromBeginning: true });
  }
  console.log(`[audit] group=${GROUP} topics=${TOPICS_IN.join(",")}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const raw = message.value?.toString("utf8") || "";
      let envelope;
      try {
        envelope = JSON.parse(raw);
      } catch {
        await deadLetter("invalid_json", raw);
        return;
      }
      const check = validateEnvelopeForStream(envelope);
      if (!check.ok) {
        await deadLetter(check.reason, raw);
        return;
      }
      await project(envelope, {
        topic,
        partition,
        offset: message.offset,
      });
      console.log(
        `[audit] accepted event_id=${envelope.event_id} type=${envelope.event_type} offset=${message.offset}`,
      );
    },
  });
}

run().catch((e) => {
  console.error("[audit] failed", e);
  process.exit(1);
});
