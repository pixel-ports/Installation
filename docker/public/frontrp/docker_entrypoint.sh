#!/bin/bash

envsubst '$$NGINX_PORT $$NGINX_TLS_PORT $$WILMA_HOST $$KEYROCK_HOST $$DASHBOARD_WEB_HOST $$DASHBOARD_BACKEND_HOST $$PIXEL_DOMAIN $$PIXEL_INTERNAL_DOMAIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
rm -f /etc/nginx/conf.d/default.conf.template

exec nginx -g 'daemon off;'
