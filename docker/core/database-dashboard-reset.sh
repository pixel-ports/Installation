#!/bin/bash

source .env


read -p "Are you sure you want to continue ERASING AND RECREATING Dashboard database ? <y/N> " prompt
if [[ $prompt == "y" || $prompt == "Y" || $prompt == "yes" || $prompt == "Yes" ]]
then

PORT=$(echo $PIXEL_DOMAIN| cut -d'.' -f 2)

PORT=$(echo $PIXEL_DOMAIN| cut -d'.' -f 2)

if [ -z "$PORT" ]
then
      PORT=""
	  echo "ERASING AND RECREATING Dashboard database with default values"
else
	  echo "ERASING AND RECREATING Dashboard database for the port: $PORT"
fi

docker-compose -f docker-compose.yaml -f docker-compose-dashboard.yaml exec dashboard-api-db /bin/sh -c "/usr/bin/mongo pixel-db --eval 'db.dropDatabase()'"
docker-compose -f docker-compose.yaml -f docker-compose-dashboard.yaml exec dashboard-api /bin/sh -c "/api/seed/insert.sh $PORT" 

echo 'seed complete'

exit 0

else
  exit 44
fi
