# Install Pixel Public Components

For ```Insiel```Installation refer to the specifics documentation : [INSIEL Process](./README-insiel.md)

## Prepare installation

Before installing PIXEL you have to install docker and docker-compose
The link to install docker-compose could change, check the last version [here](https://docs.docker.com/compose/install/)

### For Ubuntu OS

As root

```bash
apt update
apt upgrade -y
apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get install -y docker-ce docker-ce-cli containerd.io
curl -L "https://github.com/docker/compose/releases/download/1.28.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
apt install -y git
```

### For  CentOS

As root

```bash
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce docker-ce-cli containerd.io
```

If you have a conflict with podman-manpages for the last commands, try

```bash
yum remove -y podman-manpages
yum install docker-ce docker-ce-cli containerd.io
```

The continue the installation

```bash
curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
yum install git
```

### ALL OS

```bash
systemctl enable docker
systemctl start docker
```

## Retrieve the Public Archive

Install the public archive in /opt/pixel

```bash
mkdir -p /opt/pixel
cd /opt/pixel
```

```bash
git clone https://github.com/pixel-ports/Installation.git
git clone https://github.com/pixel-ports/pixel-data-models.git Data_Models
```

Later you can just run git pull to update

```bash
git pull
```

then go to the Public folder

```bash
cd /opt/pixel/Installation/docker/public
```

## Configure the scripts

Retrieve the data from the dal-provisioning after installing the [DAL-Provisioning](../core/README.md#DAL-Provisioning)

PEP_PROXY_APP should be filed with ```Appli DAL NGSIAGENTS PROXY```value

Create the ```.env``` to set the IP of the two servers.

```bash
cp .env.template .env
```

Then edit ```.env```

Set the pep proxy app id comming from the dal-provisionning ```Appli DAL NGSIAGENTS PROXY``` process for the CORE server.

Set also the DNS domain use to expose PIXEL.

```bash
PUBLIC_HOST_IP=10.66.16.137
CORE_HOST_IP=10.12.182.193
PEP_PROXY_APP=5ff34b1c-4e41-4b2e-9085-0f52b0b1c810
PIXEL_DOMAIN=.frbod.pixel-ports.eu
```

Then define the value for all secrets,

First copy the ```secrets.template``` folder to create the ```secrets````

```bash
cp -R ./secrets.template ./secrets
```

You have to edit each files in ```./secrets``` with strong and secure value.

A quicker way is to use the given docker image ```pixelh2020/secrets```` on the secrets.template folder

```bash
docker run -it --rm -v ${PWD}/secrets.template:/app/secrets pixelh2020/secrets:1.0.0
```

But some secrets need a specifics value from [DAL-Provisioning](../core/README.md#DAL-Provisioning)

* sec_wilma_pub.password : PEP Proxy password
* sec_wilma_pub.proxy.username : PEP Proxy oauth_client_id

## Network security

Depending of your infrastructure, it could be a good idea to configure ```iptables``` to prevent unwanted network trafic.

The script ```pixel-rules.install.sh``` generate the appropriate rules, it will create a file ```pixel-rules``` based on the template ```pixel-rules.template```
Edit ```pixel-rules.install.sh``` if the public interface is not ``??ns2```

Verify the content of the file !!!

```bash
#!/bin/sh
set -e

### BEGIN INIT INFO
# Provides:           pixel-rules
# Required-Start:     docker
# Required-Stop:      docker
# Default-Start:      2 3 4 5
# Default-Stop:       0 1 6
# Short-Description:  Create IPTables rules to secure the machine
# Description:
#  iptables rules to secure the machine for the PIXEL Application
### END INIT INFO

case "$1" in
        start)
                iptables -A INPUT -i ens2 -m conntrack --ctstate ESTABLISHED -j ACCEPT
                iptables -I INPUT 2 -i lo -j ACCEPT
                iptables -A INPUT -p tcp -i ens2 --dport ssh -j ACCEPT
                iptables -P INPUT DROP
                iptables -F DOCKER-USER
                iptables -A DOCKER-USER -i ens2 -m conntrack --ctstate ESTABLISHED -j RETURN
                iptables -A DOCKER-USER -i ens2 -p tcp -m tcp -m conntrack --ctorigdstport 80  -j RETURN
                iptables -A DOCKER-USER -i ens2 -p tcp -m tcp -m conntrack --ctorigdstport 443  -j RETURN
                iptables -A DOCKER-USER -i ens2 -p tcp -m tcp -m conntrack --ctorigdstport 8080 -s  -j RETURN
                iptables -A DOCKER-USER -i ens2 -p tcp -m tcp -m conntrack --ctorigdstport 5666 -s  -j RETURN
                iptables -A DOCKER-USER -i ens2 -p udp -m udp -m conntrack --ctorigdstport 53 -j RETURN
                iptables -A DOCKER-USER -i ens2 -j DROP
                iptables -A DOCKER-USER -j RETURN
                   
                ;;
        stop)
                ;;
        *)
                echo  "Usage: service docker {start|stop|restart|status}"
                exit 1
                ;;
esac
```

Then copy the file in ```/etc/init.d``` and run it

```bash
cp pixel-rules /etc/init.d
/etc/init.d/pixel-rules start
```

If something go south and you are kick out the server, reboot it, default rules should be reinstall

if it works as expected, auto-start the script

```bash
update-rc.d pixel-rules defaults
```

## Generate Certificate

We need a wildcard certificate for the choosen domain.

Here we propose to generate it using [Let's Encrypt](https://letsencrypt.org)

We choose to use ```*.<un/locode>.pixel-ports.eu```

### Generate a new certificate

In order to generate it, you will need to contact UPV to create a DNS TXT Entry
Here is the process for ```*.frbod.pixel-ports.eu```

```bash
cd /opt/pixel
mkdir -p LetsEncrypt/certbot
cd LetsEncrypt/certbot
docker run -it --rm -v ${PWD}:/etc/letsencrypt --entrypoint certbot pixelh2020/certbot certonly --manual -m infos@pixel-ports.eu -d *.frbod.pixel-ports.eu
```

You will then have to answer some question and set a TXT record on the DNS

When the DNS record is set, before continuing check the information

```bash
dig -t txt _acme-challenge.frbod.pixel-ports.eu
```

When you have the right data, press ```ENTER``` on certbot, it will generate the certificat

```bash
cp live/*.pixel-ports.eu/fullchain.pem ../../Installation/docker/public/frontrp/
cp live/*.pixel-ports.eu/privkey.pem ../../Installation/docker/public/frontrp/
```

check the dates that the certificate is valid

```bash
openssl x509 -noout -in  /opt/pixel/LetsEncrypt/certbot/live/*.pixel-ports.eu/fullchain.pem -dates
```

### Regenerate the certificate

```bash
cd /opt/pixel/LetsEncrypt/certbot

docker run -it --rm -v ${PWD}:/etc/letsencrypt --entrypoint certbot pixelh2020/certbot certonly --manual -m infos@pixel-ports.eu -d *.frbod.pixel-ports.eu
```

You will then have to answer some question and set a TXT record on the DNS

When the DNS record is set, before continuing check the information

```bash
dig -t txt _acme-challenge.frbod.pixel-ports.eu
```

When you have the right data, press ```ENTER``` on certbot, it will generate the certificat

```bash
cp live/*.pixel-ports.eu/fullchain.pem ../../Installation/docker/public/frontrp/
cp live/*.pixel-ports.eu/privkey.pem ../../Installation/docker/public/frontrp/
```

And update the platform

```bash
cd /opt/pixel/Installation/docker/public
./build.sh
./install.sh
```

## Installation

```bash
cd ../../Installation/docker/public/
```

First build the local images using the helper scripts (could take some times):

```bash
./build.sh
```

Then run the installation using the helper scripts:

```bash
./install.sh
```

This should end with something like that

```bash
Creating nrpe                   ... done
Creating dal-proxy              ... done
Creating dal-orchestrator       ... done
Creating sec-wilma-pub          ... done
Creating frontrp                ... done
```

And ```docker ps -a``` should show all containers

## Update the host

The process is simple

* update the git repo
* start the build script
* start the install script

Docker compose will update the modified components

```bash
git pull
./build.sh
./install.sh
```
