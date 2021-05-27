FROM nginx
RUN echo update full image 1.0.0
RUN apt -y update && apt -y upgrade
RUN apt-get -y install certbot python-certbot-nginx nginx-extras
RUN apt-get -y install apache2-utils
RUN openssl dhparam -out /etc/ssl/dhparam.pem 2048
COPY docker_entrypoint.sh /docker_entrypoint.sh
COPY nginx.conf /etc/nginx/nginx.conf
COPY cors.conf /etc/nginx/conf.d/cors.include
RUN chmod u+rx /docker_entrypoint.sh
RUN mkdir -p /etc/letsencrypt/live
COPY fullchain.pem /etc/ssl/fullchain.pem
COPY privkey.pem /etc/ssl/privkey.pem
COPY default.conf /etc/nginx/conf.d/default.conf.template
ENTRYPOINT ["/docker_entrypoint.sh"]
