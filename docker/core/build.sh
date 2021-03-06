#!/bin/bash
mkdir -p /opt/pixel/data/filesUp
mkdir -p /opt/pixel/kpi/nagios && chmod a+rwx /opt/pixel/kpi/nagios
cd dashboard; ./configure.sh; cd ..
cd ot-core; ./configure.sh; cd ..
docker-compose -f docker-compose.yaml -f docker-compose-security.yaml -f docker-compose-elastic.yaml -f docker-compose-ih.yaml -f docker-compose-tools.yaml -f docker-compose-ot.yaml -f docker-compose-dashboard.yaml build
