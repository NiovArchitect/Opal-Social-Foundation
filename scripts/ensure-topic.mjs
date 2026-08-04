import { Kafka, logLevel } from "kafkajs";
import { KAFKA_BROKERS, TOPICS } from "../src/lib/topics.mjs";

const kafka = new Kafka({
  clientId: "osf-admin",
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.ERROR,
});

const admin = kafka.admin();
await admin.connect();
const existing = await admin.listTopics();
const needed = [TOPICS.invitation, TOPICS.relationship, TOPICS.deadLetter];
const create = needed
  .filter((t) => !existing.includes(t))
  .map((topic) => ({ topic, numPartitions: 1, replicationFactor: 1 }));
if (create.length) {
  await admin.createTopics({ topics: create });
  console.log("created", create.map((c) => c.topic));
} else {
  console.log("topics already exist", needed);
}
await admin.disconnect();
