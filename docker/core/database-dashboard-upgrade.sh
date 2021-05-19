#!/bin/bash

source .env

PORT=$(echo $PIXEL_DOMAIN| cut -d'.' -f 2)

PORT=$(echo $PIXEL_DOMAIN| cut -d'.' -f 2)

if [ -z "$PORT" ]
then
      PORT="develop"
	  echo "Updating Dashboard database with default values"
else
	  echo "Updating Dashboard database for the port: $PORT"
fi

docker-compose -f docker-compose.yaml -f docker-compose-dashboard.yaml exec dashboard-api /bin/sh -c "/api/seed/insert.sh $PORT" 

echo 'seed complete'

exit 0
