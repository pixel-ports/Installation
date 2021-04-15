#!/bin/bash

SECRETS=/opt/pixel/Installation/docker/core/secrets
ADMIN="admin@pixel-ports.eu"
KEYROCK="http://172.26.1.6:3000"
NETWORK="core_security"
PERMISSIONS="hopu-permissions"

if [ ! -e $PERMISSIONS.json ] 
then
    cp $PERMISSIONS.json.template $PERMISSIONS.json
fi

DATA=$PERMISSIONS.`date +%Y%m%d-%H%M%S`.json
PASSWORD=`cat $SECRETS/idm.admin.pass`

cp $PERMISSIONS.json $DATA

docker run -it --rm --network $NETWORK -v $(PWD)/$DATA:/app/data/$DATA -v $(PWD)/$PERMISSIONS.json:/app/data/$PERMISSIONS.json pixelh2020/keyrock-manager:0.1.0 --keyrock $KEYROCK --admin $ADMIN --password $PASSWORD --data /app/data/$DATA --output /app/data/$PERMISSIONS.json