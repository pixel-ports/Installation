#!/bin/bash

envsubst '$$NGINX_PORT $$NGINX_TLS_PORT $$IH_DATA_EXTRACTOR_HOST $$SEC_KEYROCK_HOST $$IH_ELASTICSEARCH_PROXY_HOST $$SEC_AUTHZFORCE_HOST $$DAL_ORCHESTRATOR_HOST $$PIXEL_DOMAIN' /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
rm -f /etc/nginx/conf.d/default.conf.template

exec nginx -g 'daemon off;'