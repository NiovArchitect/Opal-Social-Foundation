/**
 * Privacy firewall for foundation ingress.
 * Rejects forbidden payload keys and disallowed privacy classes for stream topics.
 */

export const FORBIDDEN_PAYLOAD_KEYS = new Set([
  "phone",
  "phone_number",
  "e164",
  "raw_body",
  "message",
  "body",
  "contact_list",
  "contacts",
  "location",
  "precise_location",
  "latitude",
  "longitude",
  "access_token",
  "bearer",
  "session_token",
  "password",
  "card_number",
  "gift_surprise",
  "private_guidance",
  "youth_private",
  "share_token",
  "name",
  "display_name",
  "email",
]);

export const STREAM_PRIVACY = new Set([
  "public",
  "internal",
  "shared_authorized",
  "restricted",
]);

export function findForbiddenKeys(payload, path = "") {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const hits = [];
  for (const [k, v] of Object.entries(payload)) {
    const key = String(k).toLowerCase();
    const full = path ? `${path}.${key}` : key;
    if (
      FORBIDDEN_PAYLOAD_KEYS.has(key) ||
      key.includes("phone") ||
      key.includes("token") ||
      key.includes("password")
    ) {
      hits.push(full);
    }
    if (v && typeof v === "object" && !Array.isArray(v)) {
      hits.push(...findForbiddenKeys(v, full));
    }
  }
  return hits;
}

export function validateEnvelopeForStream(envelope) {
  if (!envelope || typeof envelope !== "object") {
    return { ok: false, reason: "envelope_not_object" };
  }
  const required = [
    "event_id",
    "event_type",
    "event_version",
    "occurred_at",
    "recorded_at",
    "producer",
    "partition_key",
    "topic_family",
    "privacy_class",
    "payload",
  ];
  for (const k of required) {
    if (envelope[k] === undefined || envelope[k] === null || envelope[k] === "") {
      return { ok: false, reason: `missing_${k}` };
    }
  }
  if (!STREAM_PRIVACY.has(envelope.privacy_class)) {
    return { ok: false, reason: "privacy_class_not_streamable" };
  }
  if (envelope.privacy_class === "prohibited_in_stream") {
    return { ok: false, reason: "prohibited_in_stream" };
  }
  if (typeof envelope.payload !== "object" || Array.isArray(envelope.payload)) {
    return { ok: false, reason: "payload_not_object" };
  }
  const forbidden = findForbiddenKeys(envelope.payload);
  if (forbidden.length) {
    return { ok: false, reason: "forbidden_payload_keys", keys: forbidden };
  }
  // Phase 1 allowlist of event types
  const allowedTypes = new Set([
    "invitation.accepted",
    "relationship.accepted",
  ]);
  if (!allowedTypes.has(envelope.event_type)) {
    return { ok: false, reason: "event_type_not_in_phase1" };
  }
  return { ok: true };
}
