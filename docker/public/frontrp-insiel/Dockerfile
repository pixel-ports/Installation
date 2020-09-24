FROM nginx
RUN apt -y update && apt -y upgrade
RUN apt-get -y install certbot python-certbot-nginx
RUN openssl dhparam -out /etc/ssl/dhparam.pem 2048
COPY docker_entrypoint.sh /docker_entrypoint.sh
COPY cors.conf /etc/nginx/conf.d/cors.include
RUN chmod u+rx /docker_entrypoint.sh
RUN mkdir -p /etc/letsencrypt/live
RUN apt-get -y install apache2-utils
COPY default.conf /etc/nginx/conf.d/default.conf.template
ENTRYPOINT ["/docker_entrypoint.sh"]