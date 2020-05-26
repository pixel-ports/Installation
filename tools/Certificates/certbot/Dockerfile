FROM nginx
RUN apt -y update && apt -y upgrade
RUN apt-get -y install certbot python-certbot-nginx
ENTRYPOINT [ "/bin/bash" ]