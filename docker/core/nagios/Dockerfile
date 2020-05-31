FROM pixelh2020/nagios
COPY pixel.cfg /usr/local/nagios/etc/objects/pixel.cfg
COPY pixel_cmd.cfg /usr/local/nagios/etc/objects/pixel_cmd.cfg
COPY nagios.cfg /usr/local/nagios/etc/nagios.cfg
RUN sed -i 's/CORE_HOST_IP/'${CORE_HOST_IP}'/' /usr/local/nagios/etc/objects/pixel.cfg
RUN sed -i 's/PUBLIC_HOST_IP/'${PUBLIC_HOST_IP}'/' /usr/local/nagios/etc/objects/pixel.cfg