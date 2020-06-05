#!/bin/bash

source ../.env

envsubst '$$PUBLIC_HOST_IP $$CORE_HOST_IP $$PIXEL_DOMAIN $$PIXEL_INTERNAL_DOMAIN' < ./pixel_ports/.env_production.template > ./pixel_ports/.env_production
