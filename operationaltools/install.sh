#!/bin/bash
# Regenerate WAR with the current configuration and deploy it
echo "Starting Installation process"
rm -rf tmp
mkdir tmp
cp otpixel.war  tmp/
cd tmp
echo "Generating otpixel.jar with the new configuration"
jar -xvf otpixel.war
cp ../config/swagger.json doc/
cp ../config/settings.js ui/cfg/
cp ../config/default.configuration.xml WEB-INF/classes
cp ../config/log4j2.xml WEB-INF/classes
rm otpixel.war
jar -cvf otpixel.war *
echo "Deploying the service"
service tomcat8 stop
rm -rf /var/lib/tomcat8/webapps/otpixel
rm /var/lib/tomcat8/webapps/otpixel.war
cp otpixel.war /var/lib/tomcat8/webapps/
service tomcat8 start
echo "Done"