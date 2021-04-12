#!/bin/bash
set -o allexport; source ../../docker/public/.env; set +o allexport
envsubst '$$CORE_HOST_IP' < hopu-agent.json >hopu-agent-configured.json
curl -v -X POST -H "Content-Type: application/json" -H "X-Auth-Token: `cat ../../docker/public/secrets/dal.orchestrator.api.token`" http://172.41.1.3:8080/api/ngsiagent -d @- <hopu-agent-configured.json