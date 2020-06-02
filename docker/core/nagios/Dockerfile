FROM pixelh2020/nagios
ARG CORE_HOST_IP
ARG PUBLIC_HOST_IP
ARG PIXEL_DOMAIN
RUN yum install python3 -y
RUN pip3 install pymongo
COPY check_mongod /usr/local/nagios/libexec/check_mongod
COPY check_mongod.py /usr/local/nagios/libexec/check_mongod.py
RUN pip3 install mysql-connector-python
COPY check_mysqld /usr/local/nagios/libexec/check_mysqld
COPY check_mysqld.py /usr/local/nagios/libexec/check_mysqld.py
COPY nagios.cfg /usr/local/nagios/etc/nagios.cfg
COPY pixel_cmd.cfg /usr/local/nagios/etc/objects/pixel_cmd.cfg
COPY pixel.cfg /usr/local/nagios/etc/objects/pixel.cfg
RUN sed -i 's/CORE_HOST_IP/'${CORE_HOST_IP}'/' /usr/local/nagios/etc/objects/pixel.cfg
RUN sed -i 's/PUBLIC_HOST_IP/'${PUBLIC_HOST_IP}'/' /usr/local/nagios/etc/objects/pixel.cfg
RUN sed -i 's/PIXEL_DOMAIN/'${PIXEL_DOMAIN}'/' /usr/local/nagios/etc/objects/pixel.cfg