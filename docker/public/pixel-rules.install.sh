#!/bin/bash
PUBLIC_INTERFACE=ens2
source .env
PUBLIC_INTERFACE=$PUBLIC_INTERFACE PUBLIC_HOST_IP=$CORE_HOST_IP envsubst '$$PUBLIC_INTERFACE $$CORE_HOST_IP' < pixel-rules.template > pixel-rules
chmod a=rx pixel-rules