FROM centos:7
#RUN setenforce 0
RUN yum install -y gcc glibc glibc-common openssl openssl-devel perl wget -y
#RUN useradd nagios && groupadd nagcmd && usermod -a -G nagcmd nagios && usermod -a -G nagcmd apache
RUN cd /tmp && wget --no-check-certificate -O nrpe.tar.gz https://github.com/NagiosEnterprises/nrpe/archive/nrpe-3.2.1.tar.gz && tar xzf nrpe.tar.gz
#RUN yum install gcc gcc-c++ make  -y
RUN cd /tmp/nrpe-nrpe-3.2.1/ && ./configure --enable-command-args && make all
RUN cd /tmp/nrpe-nrpe-3.2.1/ && make install-groups-users && make install && make install-config
RUN echo >> /etc/services && echo '# Nagios services' >> /etc/services && echo 'nrpe    5666/tcp' >> /etc/services
EXPOSE 5666
COPY start.sh /docker_entrypoint.sh
ENV NAGIOS_HOST=127.0.0.1
COPY libexec /usr/local/nagios/libexec
RUN sed -i 's/#include_dir=<somedirectory>/include_dir=\/usr\/local\/nagios\/etc\/conf.d/' /usr/local/nagios/etc/nrpe.cfg
RUN mkdir /usr/local/nagios/etc/conf.d
ENTRYPOINT ["/docker_entrypoint.sh"]