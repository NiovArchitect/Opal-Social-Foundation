# Privacy and data governance (Phase 0)

## Classification

Every event declares `privacy_class` and `purpose`.

## Minimization

Payloads carry authoritative IDs and minimal state, not source records.

## Forbidden general-stream content

Private messages, contacts, phones, precise locations, gift surprises, private guidance, credentials, youth private content.

## Retention

Per topic family; private-authorized streams short retention; tombstones/deletion strategies required before production.

## Replay

Only permitted historical events; never indiscriminate raw conversation replay.
