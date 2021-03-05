#!/bin/bash

docker-compose -f docker-compose.yaml -f docker-compose-ih-stop.yaml down -v
