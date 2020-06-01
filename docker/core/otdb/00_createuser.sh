#!/bin/bash
set -eu
#export MONGO_INITDB_ROOT_PASSWORD=`cat $MONGO_INITDB_ROOT_PASSWORD_FILE`
export OTDB_PASSWORD=`cat $OTDB_PASSWORD_FILE`
mongo -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD $MONGO_INITDB_DATABASE << EOF
use $OTDB_DATABASE
db.createUser({ user: 'otdb', pwd: "$OTDB_PASSWORD", roles: [ { role: 'userAdmin', db: "$OTDB_DATABASE"}, { role: 'readWrite', db: "$OTDB_DATABASE"}, {role: 'dbAdmin', db: "$OTDB_DATABASE"} ] } );
EOF
