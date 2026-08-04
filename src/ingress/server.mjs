/**
 * Foundation ingress — synthetic fixtures only.
 * Validates envelope + privacy, produces to Kafka-compatible topic.
 * Does not connect to production Opal.
 */

import http from "http";
import { Kafka, logLevel } from "kafkajs";
import { validateEnvelopeForStream } from "../lib/privacy.mjs";
import { KAFKA_BROKERS, topicForEventType } from "../lib/topics.mjs";

const PORT = Number(process.env.OSF_INGRESS_PORT || 4100);

const kafka = new Kafka({
  clientId: "osf-ingress",
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.ERROR,
});
const producer = kafka.producer();

let ready = false;

async function start() {
  await producer.connect();
  ready = true;
  console.log(`[ingress] connected brokers=${KAFKA_BROKERS.join(",")}`);
}

async function handleIngest(body) {
  let envelope;
  try {
    envelope = JSON.parse(body);
  } catch {
    return { status: 400, json: { ok: false, error: "invalid_json" } };
  }

  const check = validateEnvelopeForStream(envelope);
  if (!check.ok) {
    return {
      status: 422,
      json: { ok: false, error: check.reason, keys: check.keys || [] },
    };
  }

  const topic = topicForEventType(envelope.event_type);
  const result = await producer.send({
    topic,
    messages: [
      {
        key: envelope.partition_key,
        value: JSON.stringify(envelope),
        headers: {
          event_id: envelope.event_id,
          event_type: envelope.event_type,
          privacy_class: envelope.privacy_class,
        },
      },
    ],
  });

  const meta = result[0] || {};
  return {
    status: 202,
    json: {
      ok: true,
      event_id: envelope.event_id,
      topic,
      partition: meta.partition,
      offset: meta.baseOffset,
    },
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, ready, service: "osf-ingress" }));
    return;
  }

  if (req.method === "POST" && req.url === "/v1/events") {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = Buffer.concat(chunks).toString("utf8");
    try {
      if (!ready) {
        res.writeHead(503, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "not_ready" }));
        return;
      }
      const out = await handleIngest(body);
      res.writeHead(out.status, { "content-type": "application/json" });
      res.end(JSON.stringify(out.json));
    } catch (e) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "produce_failed", detail: String(e.message || e) }));
    }
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: "not_found" }));
});

start()
  .then(() => {
    server.listen(PORT, "127.0.0.1", () => {
      console.log(`[ingress] listening http://127.0.0.1:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("[ingress] failed", e);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  await producer.disconnect().catch(() => {});
  process.exit(0);
});
