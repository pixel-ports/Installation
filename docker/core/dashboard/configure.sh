#!/bin/bash

set -o allexport
source ../.env
set +o allexport

envsubst '$$PUBLIC_HOST_IP $$CORE_HOST_IP $$PIXEL_DOMAIN $$PIXEL_INTERNAL_DOMAIN' < ./pixel_ports/.env.production.template > ./pixel_ports/.env.production
