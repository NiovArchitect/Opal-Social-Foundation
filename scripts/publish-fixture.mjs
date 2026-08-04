import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const name = process.argv[2] || "invitation.accepted.json";
const body = readFileSync(join(root, "fixtures", name), "utf8");
const port = process.env.OSF_INGRESS_PORT || 4100;

const res = await fetch(`http://127.0.0.1:${port}/v1/events`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body,
});
const json = await res.json();
console.log(res.status, json);
if (!res.ok && res.status !== 422) process.exit(1);
