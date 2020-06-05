#!/bin/bash
docker-compose -f docker-compose.yaml -f docker-compose-elastic.yaml -f docker-compose-ih.yaml -f docker-compose-tools.yaml -f docker-compose-ot.yaml -f docker-compose-dashboard.yaml build