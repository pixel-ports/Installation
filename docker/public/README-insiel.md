# Install Pixel Public Components

The installation on Insiel environment is a bit different because the SSL ReverseProxy is mange directly by Insiel. So they are no need of certificates and the frontrp configuration is different than other platform.

## Prepare installation
## Prepare installation
Before installing PIXEL you have to install docker and docker-compose
The link to install docker-compose could change, check the last version [here](https://docs.docker.com/compose/install/)

### For Ubuntu OS

As root

```
apt update
apt upgrade -y
apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get install -y docker-ce docker-ce-cli containerd.io
curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
apt install -y git
```
### For  CentOS

As root
```
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce docker-ce-cli containerd.io
```
If you have a conflict with podman-manpages for the last commands, try
```
yum remove -y podman-manpages
yum install docker-ce docker-ce-cli containerd.io
```

The continue the installation
```
curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
yum install git
```

### ALL OS
```
systemctl enable docker
systemctl start docker
```


## Retrieve the Public Archive
Install the public archive in /opt/pixel

```
mkdir -p /opt/pixel
cd /opt/pixel
```

Using GIT with pixel/p1x3l account
```
GIT_SSL_NO_VERIFY=false git clone https://gitpixel.satrdlab.upv.es/marc.despland/Installation.git
GIT_SSL_NO_VERIFY=false git clone https://gitpixel.satrdlab.upv.es/iglaub/Data_Models.git
```

Later you can just run git pull to update
```
GIT_SSL_NO_VERIFY=false git pull
```

then go to the Public folder
```
cd /opt/pixel/Installation/docker/public
```

## Configure the scripts 

Retrieve the data from the dal-provisioning after installing the [DAL-Provisioning](../core/README.md#DAL-Provisioning)

PEP_PROXY_APP should be filed with ```Appli DAL NGSIAGENTS PROXY```value

Create the ```.env``` to set the IP of the two servers.

```
cp .env.template .env
```

Then edit ```.env```

Set the pep proxy app id comming from the dal-provisionning process for the CORE server.

Set also the DNS domain use to expose PIXEL. 

```
PUBLIC_HOST_IP=10.66.16.137
CORE_HOST_IP=10.12.182.193
PEP_PROXY_APP=5ff34b1c-4e41-4b2e-9085-0f52b0b1c810
PIXEL_DOMAIN=-pixel.insiel.it
```
 
 Then define the value for all secrets, you have to edit each files in ```./secrets``` with strong and secure value.

 A quicker way is to use the given docker image ```pixelh2020/secrets````

```
docker run -it --rm -v ${PWD}/secrets:/app/secrets pixelh2020/secrets:1.0.0
```

But some secrets need a specifics value from [DAL-Provisioning](../core/README.md#DAL-Provisioning)
* sec_wilma_pub.password : PEP Proxy password
* sec_wilma_pub.proxy.username : PEP Proxy oauth_client_id


## Network security

Depending of your infrastructure, it could be a good idea to configure ```iptables``` to prevent unwanted network trafic.

The script ```pixel-rules.install.sh``` generate the appropriate rules, it will create a file ```pixel-rules``` based on the template ```pixel-rules.template```
Edit ```pixel-rules.install.sh``` if the public interface is not ``èns2```

Verify the content of the file !!!

```
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

```
cp pixel-rules /etc/init.d
/etc/init.d/pixel-rules start
```

If something go south and you are kick out the server, reboot it, default rules should be reinstall

if it works as expected, auto-start the script
```
update-rc.d pixel-rules defaults
```

## Installation

First replace the docker-compose file:
```
cp docker-compose-insiel.yaml docker-compose.yaml
```

First build the local images using the helper scripts (could take some times):
```
./build.sh
```

Then run the installation using the helper scripts:
```
./install.sh
```

This should end with something like that
```
Creating dal-provisioning           ... done
Creating core_zookeeper_1           ... done
Creating sec-mysql-db               ... done
Creating core_elasticsearch_1       ... done
Creating dal-orion-db               ... done
Creating nagios                     ... done
Creating sec-authzforce             ... done
Creating core_elasticsearch-proxy_1 ... done
Creating core_dal-orion_1           ... done
Creating core_kibana_1              ... done
Creating core_kafka_1               ... done
Creating sec-keyrock                ... done
Creating core_writer_1              ... done
Creating core_orion-collector_1     ... done
Creating core_extractor_1           ... done
Creating core_controller_1          ... done
Creating core_monitor_1             ... done
Creating dal-inquisitor             ... done
Creating internal-proxy             ... done
```

And ```docker ps -a``` should show all containers 

# Update the host

The process is simple
* update the git repo
* start the build script
* start the install script

Docker compose will update the modified components

```
GIT_SSL_NO_VERIFY=false git pull
./build.sh
./install.sh
```
