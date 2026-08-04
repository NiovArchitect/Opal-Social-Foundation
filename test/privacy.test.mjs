import test from "node:test";
import assert from "node:assert/strict";
import {
  findForbiddenKeys,
  validateEnvelopeForStream,
} from "../src/lib/privacy.mjs";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("rejects phone in payload", () => {
  const hits = findForbiddenKeys({ invitation_id: "x", phone: "+1" });
  assert.ok(hits.includes("phone"));
});

test("fixture invitation.accepted is stream-valid", () => {
  const env = JSON.parse(
    readFileSync(join(root, "fixtures/invitation.accepted.json"), "utf8"),
  );
  const v = validateEnvelopeForStream(env);
  assert.equal(v.ok, true);
});

test("poison fixture rejected", () => {
  const env = JSON.parse(
    readFileSync(join(root, "fixtures/poison.phone.json"), "utf8"),
  );
  const v = validateEnvelopeForStream(env);
  assert.equal(v.ok, false);
  assert.equal(v.reason, "forbidden_payload_keys");
});

test("unknown event type rejected in phase1", () => {
  const env = JSON.parse(
    readFileSync(join(root, "fixtures/invitation.accepted.json"), "utf8"),
  );
  env.event_type = "payment.authorized";
  env.event_id = "evt_other";
  const v = validateEnvelopeForStream(env);
  assert.equal(v.ok, false);
});
