#!/bin/bash
docker run -it --rm -e "KEYROCK_ADMIN_PASSWORD_FILE=/run/secrets/idm.admin.pass" -e "KEYROCK_ADMIN_LOGIN=admin@pixel-ports.eu" \
    -e "KEOCK_API=http://172.26.1.6:3000" -e "ORION_API=http://172.28.1.10:1026" -e "DAL_INQUISITOR_API=http://172.28.1.201:8080" \
    -v ${PWD}/secrets/idm.admin.pass:/run/secrets/idm.admin.pas --network core_dal --network core_security
    pixelh2020/dal-provisioning:1.0.1