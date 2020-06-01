FROM pixelh2020/nrpe
COPY pixel.cfg /usr/local/nagios/etc/conf.d/pixel.cfg
RUN sed -i 's/dont_blame_nrpe=0/dont_blame_nrpe=1/' /usr/local/nagios/etc/nrpe.cfg