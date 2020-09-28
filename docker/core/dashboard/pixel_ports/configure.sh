#!/bin/sh
envsubst '$$PIXEL_DOMAIN' < .env.production.template > .env.production
