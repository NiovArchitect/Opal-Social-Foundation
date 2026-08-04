/**
 * Rebuild relationship_acceptance_projection from audit_events (foundation store).
 * Does not touch Kafka or Opal.
 */
import pg from "pg";
import { PG_URL } from "../src/lib/topics.mjs";

const pool = new pg.Pool({ connectionString: PG_URL });
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("TRUNCATE relationship_acceptance_projection");
  const { rows } = await client.query(
    `SELECT event_id, event_type, payload, envelope, ingested_at
     FROM audit_events
     WHERE event_type IN ('invitation.accepted', 'relationship.accepted')
     ORDER BY ingested_at ASC`,
  );
  let n = 0;
  for (const r of rows) {
    const payload = r.payload;
    const invitationId = payload.invitation_id;
    const relationshipId = payload.relationship_id;
    if (!invitationId || !relationshipId) continue;
    const acceptedAt =
      (r.envelope && r.envelope.occurred_at) || r.ingested_at || new Date();
    await client.query(
      `INSERT INTO relationship_acceptance_projection (
        invitation_id, relationship_id, event_id, accepted_at, updated_at
      ) VALUES ($1,$2,$3,$4,NOW())
      ON CONFLICT (invitation_id) DO UPDATE SET
        relationship_id = EXCLUDED.relationship_id,
        event_id = EXCLUDED.event_id,
        accepted_at = EXCLUDED.accepted_at,
        updated_at = NOW()`,
      [invitationId, relationshipId, r.event_id, acceptedAt],
    );
    n++;
  }
  await client.query("COMMIT");
  console.log(JSON.stringify({ ok: true, rebuilt_rows: n }));
} catch (e) {
  await client.query("ROLLBACK");
  console.error(e);
  process.exit(1);
} finally {
  client.release();
  await pool.end();
}
