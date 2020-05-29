#!/bin/bash

if [ ! -f /usr/local/nagios/etc/htpasswd.users ] ; then
  if [ ! -z "${NAGIOSADMIN_PASSWORD_FILE}" ] ; then
    pass=$(< ${NAGIOSADMIN_PASSWORD_FILE})
    echo "Read password from secret"
  else
    pass=${NAGIOSADMIN_PASSWORD}
    echo "Read password from variable"
  fi
  htpasswd -c -b /usr/local/nagios/etc/htpasswd.users ${NAGIOSADMIN_USER} ${pass}
  chown -R nagios.nagios /usr/local/nagios/etc/htpasswd.users
fi

/usr/local/nagios/bin/nagios /usr/local/nagios/etc/nagios.cfg &

exec /usr/sbin/httpd -DFOREGROUND