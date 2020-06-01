#!/bin/bash

apt-get -y update
apt-get -y upgrade
apt-get -y install dialog apt-utils
apt-get -y install openjdk-8-jdk wget curl

# Avoid Tomcat slow start
apt-get -y install haveged
apt-get -y install tomcat8 tomcat8-admin

# This migh not be necessary if mongo is available  through a docker or external service
#sudo apt-get -y install mongodb

# Useful libraries
apt-get -y install net-tools git zip unzip dos2unix

# Remove jdk-11 (probably in the upgrade process it is installed. Just keep  JDK 8 version)
apt-get remove openjdk-11-jre-headless

usermod -aG docker tomcat8

echo "Checking for Directory /var/lib/tomcat8/.docker...."
if [ -d "/var/lib/tomcat8/.docker" ] 
then
    echo "Directory /var/lib/tomcat8/.docker already  exists. No need to create it" 
else
    echo "Directory /var/lib/tomcat8/.docker does not exists. Creating it..."
    mkdir /var/lib/tomcat8/.docker
    chown -R tomcat8 /var/lib/tomcat8/.docker
    echo "Done"
fi

cp tomcat-users.xml /var/lib/tomcat8/conf
chown -R tomcat8 /var/lib/tomcat8/conf/tomcat-users.xml 