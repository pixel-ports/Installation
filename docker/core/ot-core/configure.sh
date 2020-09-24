#!/bin/bash

set -o allexport
source ../.env
set +o allexport

export OTDB_PASSWORD = `echo ../secrets/ot.db.password`
envsubst '$$PUBLIC_HOST_IP $$CORE_HOST_IP $$PIXEL_DOMAIN $$PIXEL_INTERNAL_DOMAIN $$OTDB_PWSSWORD' < default.configuration.xml.template > default.configuration.xml
