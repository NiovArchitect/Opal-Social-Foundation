/**
 * End-to-end Phase 1 smoke against local compose stack.
 * Requires: docker compose up, ensure-topic, ingress, consumer running.
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { PG_URL } from "../src/lib/topics.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.OSF_INGRESS_PORT || 4100;
const pool = new pg.Pool({ connectionString: PG_URL });

async function postFixture(name) {
  const body = readFileSync(join(root, "fixtures", name), "utf8");
  const res = await fetch(`http://127.0.0.1:${port}/v1/events`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
  const json = await res.json();
  return { status: res.status, json };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const results = [];

// health
const health = await fetch(`http://127.0.0.1:${port}/health`).then((r) => r.json());
results.push(["health", health.ok === true]);

// privacy reject
const poison = await postFixture("poison.phone.json");
results.push(["privacy_reject", poison.status === 422]);

// accept path
const a1 = await postFixture("invitation.accepted.json");
results.push(["ingest_invitation", a1.status === 202]);
const a2 = await postFixture("invitation.accepted.json");
results.push(["duplicate_produce_ok", a2.status === 202]);

const r1 = await postFixture("relationship.accepted.json");
results.push(["ingest_relationship", r1.status === 202]);

// wait for consumer
let auditCount = 0;
for (let i = 0; i < 20; i++) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM audit_events WHERE event_id LIKE 'evt_fixture_%'`,
  );
  auditCount = rows[0].n;
  if (auditCount >= 2) break;
  await sleep(500);
}
results.push(["audit_projected", auditCount >= 2]);

const { rows: idemp } = await pool.query(
  `SELECT COUNT(*)::int AS n FROM audit_events WHERE event_id = 'evt_fixture_inv_accepted_001'`,
);
results.push(["idempotent_single_row", idemp[0].n === 1]);

const { rows: proj } = await pool.query(
  `SELECT relationship_id FROM relationship_acceptance_projection WHERE invitation_id = 'inv_fixture_001'`,
);
results.push(["projection_present", proj.length === 1 && proj[0].relationship_id === "rel_fixture_001"]);

// replay
const { execSync } = await import("child_process");
execSync("node scripts/replay-projection.mjs", { cwd: root, stdio: "pipe" });
const { rows: proj2 } = await pool.query(
  `SELECT relationship_id FROM relationship_acceptance_projection WHERE invitation_id = 'inv_fixture_001'`,
);
results.push(["replay_ok", proj2.length === 1]);

await pool.end();

let failed = 0;
for (const [name, ok] of results) {
  console.log(ok ? "PASS" : "FAIL", name);
  if (!ok) failed++;
}
process.exit(failed ? 1 : 0);
