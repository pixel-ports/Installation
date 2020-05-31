FROM nginx
RUN apt -y update && apt -y upgrade
RUN apt-get -y install certbot python-certbot-nginx
RUN openssl dhparam -out /etc/ssl/dhparam.pem 2048 
COPY default.conf /etc/nginx/conf.d/default.conf.template
COPY cors.conf /etc/nginx/conf.d/cors.include
COPY docker_entrypoint.sh /docker_entrypoint.sh
COPY pixel.internal.crt /etc/ssl/fullchain.pem
COPY pixel.privatekey.pem /etc/ssl/privkey.pem
RUN chmod u+rx /docker_entrypoint.sh
RUN mkdir -p /etc/letsencrypt/live
ENTRYPOINT ["/docker_entrypoint.sh"]