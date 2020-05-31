#!/bin/bash
PUBLIC_INTERFACE=ens2
source .env
PUBLIC_INTERFACE=$PUBLIC_INTERFACE PUBLIC_HOST_IP=$PUBLIC_HOST_IP envsubst '$$PUBLIC_INTERFACE $$PUBLIC_HOST_IP' < pixel-rules.sh.template > pixel-rules.sh
chmod a=rx pixel-rules.sh