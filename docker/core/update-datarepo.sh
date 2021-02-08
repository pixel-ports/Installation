#!/bin/bash
docker-compose -f docker-compose.yaml -f docker-compose-security.yaml -f docker-compose-elastic.yaml -f docker-compose-ih.yaml -f docker-compose-tools.yaml -f docker-compose-ot.yaml -f docker-compose-dashboard.yaml build --no-cache datarepo
docker-compose -f docker-compose.yaml -f docker-compose-security.yaml -f docker-compose-elastic.yaml -f docker-compose-ih.yaml -f docker-compose-tools.yaml -f docker-compose-ot.yaml -f docker-compose-dashboard.yaml up -d datarepo
