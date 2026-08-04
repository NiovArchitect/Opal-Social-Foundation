/**
 * Phase 2: publish synthetic envelopes that match Opal outbox shape to foundation ingress.
 * Does NOT connect to production Opal or live databases.
 *
 * Usage:
 *   node scripts/bridge-from-opal-outbox.mjs
 *   OPAL_OUTBOX_EXPORT=path/to/export.json node scripts/bridge-from-opal-outbox.mjs
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.OSF_INGRESS_PORT || 4100;
const exportPath = process.env.OPAL_OUTBOX_EXPORT;

async function post(envelope) {
  const res = await fetch(`http://127.0.0.1:${port}/v1/events`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-opal-event-id": envelope.event_id,
      "x-opal-producer": envelope.producer || "opal_core",
    },
    body: JSON.stringify(envelope),
  });
  const json = await res.json();
  return { status: res.status, json };
}

let envelopes = [];
if (exportPath && existsSync(exportPath)) {
  const raw = JSON.parse(readFileSync(exportPath, "utf8"));
  envelopes = Array.isArray(raw) ? raw : raw.envelopes || [];
  console.log(`loaded ${envelopes.length} envelopes from export`);
} else {
  // Synthetic Opal-shaped fixtures (same as Phase 1, producer opal_core)
  for (const name of ["invitation.accepted.json", "relationship.accepted.json"]) {
    const env = JSON.parse(readFileSync(join(root, "fixtures", name), "utf8"));
    env.producer = "opal_core";
    envelopes.push(env);
  }
  console.log("using synthetic opal_core-shaped fixtures (no live Opal DB)");
}

const results = [];
for (const env of envelopes) {
  const r = await post(env);
  results.push({ event_id: env.event_id, status: r.status, ok: r.json.ok });
  console.log(r.status, env.event_id, r.json.error || "accepted");
}

// poison should fail
const poison = JSON.parse(readFileSync(join(root, "fixtures/poison.phone.json"), "utf8"));
const pr = await post(poison);
results.push({ event_id: poison.event_id, status: pr.status, ok: pr.json.ok });
console.log(pr.status, "poison", pr.json.error);

const ok =
  results.filter((r) => r.event_id !== "evt_fixture_poison_001").every((r) => r.status === 202) &&
  pr.status === 422;

process.exit(ok ? 0 : 1);
