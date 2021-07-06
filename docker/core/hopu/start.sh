#!/bin/bash
docker-compose -f docker-compose-hopu.yaml -f ../docker-compose.yaml --project-name core up -d
