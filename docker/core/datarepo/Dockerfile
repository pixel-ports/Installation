FROM nginx
RUN apt update && apt install -y git
RUN mkdir -p /opt/pixel/datamodels
RUN cd /opt/pixel/datamodels && git init && git remote add origin https://github.com/pixel-ports/pixel-data-models.git && GIT_SSL_NO_VERIFY=true git pull origin master
COPY default.conf /etc/nginx/conf.d/default.conf