FROM centos:7
#RUN setenforce 0
RUN yum install httpd php php-cli gcc glibc glibc-common gd gd-devel net-snmp openssl-devel wget unzip -y
RUN useradd nagios && groupadd nagcmd && usermod -a -G nagcmd nagios && usermod -a -G nagcmd apache
RUN cd /tmp && wget https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.4.5.tar.gz && wget http://www.nagios-plugins.org/download/nagios-plugins-2.3.3.tar.gz && tar zxf nagios-4.4.5.tar.gz && tar zxf nagios-plugins-2.3.3.tar.gz
RUN yum install gcc gcc-c++ make  -y
RUN cd /tmp/nagios-4.4.5 && ./configure --with-command-group=nagcmd && make all && make install && make install-init && make install-config && make install-commandmode && make install-webconf
#RUN htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin
RUN cd /tmp/nagios-plugins-2.3.3 && ./configure --with-nagios-user=nagios --with-nagios-group=nagios --with-openssl=/usr/lib64/openssl && make all && make install
COPY start.sh /docker_entrypoint.sh
EXPOSE 80
ENV NAGIOSADMIN_USER=nagiosadmin
ENV NAGIOSADMIN_PASSWORD=changeit
COPY check_nrpe /usr/local/nagios/libexec/check_nrpe
ENTRYPOINT ["/docker_entrypoint.sh"]