FROM nginx
RUN apt -y update && apt -y upgrade
RUN apt-get -y install certbot python-certbot-nginx
ENTRYPOINT [ "certbot" ]
CMD [ "certonly", "--manual", "-m", "infos@pixel-ports.eu", "-d" ]