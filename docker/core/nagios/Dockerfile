FROM pixelh2020/nagios
ARG CORE_HOST_IP
ARG PUBLIC_HOST_IP
ARG PIXEL_DOMAIN
RUN yum install python3 -y
RUN pip3 install pymongo
COPY plugins/check_mongod /usr/local/nagios/libexec/check_mongod
COPY plugins/check_mongod.py /usr/local/nagios/libexec/check_mongod.py
RUN pip3 install mysql-connector-python
COPY plugins/check_mysqld /usr/local/nagios/libexec/check_mysqld
COPY plugins/check_mysqld.py /usr/local/nagios/libexec/check_mysqld.py
RUN pip3 install Kazoo
COPY plugins/check_zookeeper /usr/local/nagios/libexec/check_zookeeper
COPY plugins/check_zookeeper.py /usr/local/nagios/libexec/check_zookeeper.py
RUN pip3 install Kafka-Python
COPY plugins/check_kafka /usr/local/nagios/libexec/check_kafka
COPY plugins/check_kafka.py /usr/local/nagios/libexec/check_kafka.py
COPY nagios.cfg /usr/local/nagios/etc/nagios.cfg
COPY pixel_cmd.cfg /usr/local/nagios/etc/objects/pixel_cmd.cfg
COPY pixel.cfg /usr/local/nagios/etc/objects/pixel.cfg
RUN sed -i 's/CORE_HOST_IP/'${CORE_HOST_IP}'/' /usr/local/nagios/etc/objects/pixel.cfg
RUN sed -i 's/PUBLIC_HOST_IP/'${PUBLIC_HOST_IP}'/' /usr/local/nagios/etc/objects/pixel.cfg
RUN sed -i 's/PIXEL_DOMAIN/'${PIXEL_DOMAIN}'/' /usr/local/nagios/etc/objects/pixel.cfg