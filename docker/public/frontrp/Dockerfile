FROM nginx
RUN apt -y update && apt -y upgrade
RUN apt-get -y install certbot python-certbot-nginx
RUN openssl dhparam 2048 -out /etc/ssl/dhparam.pem
COPY default.conf /etc/nginx/conf.d/default.conf.template
COPY docker_entrypoint.sh /docker_entrypoint.sh
COPY fullchain.pem /etc/ssl/fullchain.pem
COPY privkey.pem /etc/ssl/privkey.pem
RUN chmod u+rx /docker_entrypoint.sh
RUN mkdir -p /etc/letsencrypt/live
ENTRYPOINT ["/docker_entrypoint.sh"]