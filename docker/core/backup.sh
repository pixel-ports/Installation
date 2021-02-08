#!/bin/bash
mkdir -p /opt/pixel/backup
mkdir -p /opt/pixel/backup/sec-mysql-db
mkdir -p /opt/pixel/backup/dal-orion-db
mkdir -p /opt/pixel/backup/otdbdocker inspect 

docker exec -it sec-mysql-db mysqldump -u root -p`cat ./secrets/idm.db.pass` idm >/opt/pixel/backup/sec-mysql-db/sec-mysql-db-`date +%Y%m%d-%H%M%S`.sql
docker exec -it dal-orion-db mongodump -u mongo -p `cat ./secrets/orion.db.root.password`  mongodb://127.0.0.1 -o /tmp/backup-orion
docker cp dal-orion-db:/tmp/backup-orion /opt/pixel/backup/dal-orion-db/mongo-`date +%Y%m%d-%H%M%S`
docker exec -it otdb mongodump -u mongo -p `cat ./secrets/ot.db.root.password`  mongodb://127.0.0.1 -o /tmp/backup-ot
docker cp otdb:/tmp/backup-ot /opt/pixel/backup/otdb/mongo-`date +%Y%m%d-%H%M%S`