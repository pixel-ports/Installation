#!/bin/bash
source .env
PIXEL_INTERNAL_DOMAIN=$PIXEL_INTERNAL_DOMAIN CORE_HOST_IP=$CORE_HOST_IP envsubst '$$PIXEL_INTERNAL_DOMAIN $$CORE_HOST_IP' < hosts.template >> /etc/hosts