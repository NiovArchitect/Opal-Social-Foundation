# Phase 1 local runbook

```bash
export DOCKER_HOST=unix://$HOME/.colima/default/docker.sock   # if using Colima

npm install
npm run dev:up
# wait for health
npm run dev:topic

# terminal 1
npm run consumer

# terminal 2
npm run ingress

# terminal 3
npm run fixture:publish invitation.accepted.json
npm run fixture:publish relationship.accepted.json
npm run fixture:publish poison.phone.json   # expect 422

npm run phase1:smoke
npm run replay
npm test
```

Stop:

```bash
npm run dev:down
```
