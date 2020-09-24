#!/bin/bash

set -o allexport
source ../.env
set +o allexport

export OTDB_PASSWORD=`cat ../secrets/ot.db.password`
envsubst '$$PUBLIC_HOST_IP $$CORE_HOST_IP $$PIXEL_DOMAIN $$PIXEL_INTERNAL_DOMAIN $$OTDB_PASSWORD' < default.configuration.xml.template > default.configuration.xml
