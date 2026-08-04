#!/usr/bin/env node
/**
 * Phase 0 contract smoke checks — no network, no Kafka, no secrets.
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "README.md",
  "docs/PRODUCT_TRUTH.md",
  "docs/AUTHORITY_BOUNDARY.md",
  "docs/ORIGINAL_FOUNDATION_ASSESSMENT.md",
  "docs/planes/OVERVIEW.md",
  "docs/adr/0001-kafka-role.md",
  "docs/contracts/EVENT_ENVELOPE.md",
  "docs/contracts/EVENT_CATALOG.md",
  "docs/contracts/TOPIC_FAMILIES.md",
  "docs/contracts/OPAL_BRIDGE.md",
  "docs/contracts/envelope.schema.json",
  "docs/AGENT_MODEL.md",
  "docs/AVP2_BOUNDARY.md",
  "docs/SECURITY_MODEL.md",
  "docs/PRIVACY_MODEL.md",
  "docs/PHASE1_FIRST_SLICE.md",
  "docs/PHASE1_RUNBOOK.md",
  "docs/evidence/PHASE1_LEDGER.md",
  "docker-compose.yml",
  "fixtures/invitation.accepted.json",
  "src/ingress/server.mjs",
  "src/consumers/audit_consumer.mjs",
  "templates/agents/capability.template.json",
  "templates/providers/connector.template.json",
];

let failed = 0;
for (const rel of required) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    console.error("MISSING", rel);
    failed++;
  }
}

const schema = JSON.parse(
  readFileSync(join(root, "docs/contracts/envelope.schema.json"), "utf8"),
);
if (!schema.required?.includes("privacy_class")) {
  console.error("schema missing privacy_class requirement");
  failed++;
}
if (!schema.required?.includes("partition_key")) {
  console.error("schema missing partition_key requirement");
  failed++;
}

const sample = {
  event_id: "evt_test_0001",
  event_type: "relationship.accepted",
  event_version: 1,
  occurred_at: "2026-08-04T00:00:00Z",
  recorded_at: "2026-08-04T00:00:01Z",
  producer: "opal_core",
  partition_key: "rel_1",
  topic_family: "opal.relationship.events",
  privacy_class: "shared_authorized",
  payload: { relationship_id: "rel_1" },
};
for (const k of schema.required) {
  if (!(k in sample)) {
    console.error("sample missing", k);
    failed++;
  }
}

// Forbidden payload keys must not appear in sample
const forbidden = ["phone", "access_token", "message", "contact_list"];
for (const k of Object.keys(sample.payload)) {
  if (forbidden.includes(k)) {
    console.error("forbidden key in sample", k);
    failed++;
  }
}

if (failed) {
  console.error(`FAILED ${failed} checks`);
  process.exit(1);
}
console.log("OK Phase 0 contract smoke checks passed");
