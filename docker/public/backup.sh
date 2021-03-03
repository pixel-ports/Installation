#!/bin/bash
mkdir -p /opt/pixel/backup
mkdir -p /opt/pixel/backup/secrets
mkdir -p /opt/pixel/backup/ngsiagents

cp -R secrets /opt/pixel/backup/secrets/`date +%Y%m%d-%H%M%S`/
curl -H "X-Auth-Token: `cat ./secrets/dal.orchestrator.api.token`" "http://127.0.0.1:8080/api/ngsiagent?details=full" >/opt/pixel/backup/ngsiagents/`date +%Y%m%d-%H%M%S`.ngsiagents.json
