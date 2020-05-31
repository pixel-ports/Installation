#!/bin/bash

if [ "$NAGIOS_HOST" != "127.0.0.1" ]
then
  sed -i '/^allowed_hosts=/s/$/,'${NAGIOS_HOST}'/' /usr/local/nagios/etc/nrpe.cfg
fi

exec /usr/local/nagios/bin/nrpe -c /usr/local/nagios/etc/nrpe.cfg -f