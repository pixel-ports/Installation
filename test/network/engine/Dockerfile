FROM ubuntu
RUN apt -y update && apt -y upgrade
RUN apt install -y curl nginx net-tools
CMD ["nginx", "-g", "daemon off;"]