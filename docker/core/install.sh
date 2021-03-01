#!/bin/bash

wait_for_orion() {
  while true
    do curl -s -o /dev/null http://127.0.0.1:1026/version
    if [ $? -eq 0 ]; then
      break
    fi
    echo -n '#'
    sleep 10
  done;
  echo
}

docker-compose -f docker-compose.yaml -f docker-compose-security.yaml -f docker-compose-elastic.yaml -f docker-compose-ih.yaml -f docker-compose-tools.yaml -f docker-compose-ot.yaml  -f docker-compose-dashboard.yaml up -d
sleep 5
docker restart core_monitor_1 core_controller_1

curl -s -o /dev/null http://127.0.0.1:1026/version
if [ $? -ne 0 ]; then
  echo 'Please wait. Checking for Orion up and running...'
  wait_for_orion
fi
echo 'Install complete !'
