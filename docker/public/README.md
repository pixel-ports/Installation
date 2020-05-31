# Install Pixel Core Components

## Prepare installation
Before installing PIXEL you have to install docker and docker-compose

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

## Retrieve the Core Archive
Install the core archive in /opt/pixel

Using GIT :
```
GIT_SSL_NO_VERIFY=false git clone https://gitpixel.satrdlab.upv.es/marc.despland/Installation.git
```

Later you can just run git pull to update
```
GIT_SSL_NO_VERIFY=false git pull
```

then go to the Core folder
```
cd /opt/pixel/Installation/docker/core
```

## Configure the scripts 

This part is easy :

Edit the ```.env``` to set the IP of the two servers.
```
PUBLIC_HOST_IP=10.66.16.137
CORE_HOST_IP=10.12.182.193
```
 
 Then define the value for all secrets, you have to edit each files in ```./secrets``` with strong and secure value.

 A quicker way is to use the given docker image ```pixelh2020/secrets````

```
docker run -it --rm -v ${PWD}/secrets:/app/secrets pixelh2020/secrets:1.0.0
```

## Network security

Depending of your infrastructure, it could be a good idea to configure ```iptables``` to prevent unwanted network trafic.

The script ```pixel-rules.install.sh``` generate the appropriate rules, it will create a file ```pixel-rules``` based on the template ```pixel-rules.template```
Edit ```pixel-rules.install.sh``` if the public interface is not ``èns2```

Verify the content of the file !!!

```
#!/bin/sh
set -e

 ### BEGIN INIT INFO
 # Provides:           docker
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
                   #iptables -A INPUT -i ens2 -m conntrack --ctstate ESTABLISHED -j ACCEPT
                   #iptables -I INPUT 2 -i lo -j ACCEPT
                   #iptables -A INPUT -p tcp -i ens2 --dport ssh -j ACCEPT
                   #iptables -P INPUT DROP
                   iptables -F DOCKER-USER
                   iptables -A DOCKER-USER -i ens2 -p tcp -m tcp -m conntrack --ctorigdstport 3080 -s 10.66.16.137 -j RETURN
                   iptables -A DOCKER-USER -i ens2 -p tcp -m tcp -m conntrack --ctorigdstport 3000 -s 10.66.16.137 -j RETURN
                   iptables -A DOCKER-USER -i ens2 -p tcp -m tcp -m conntrack --ctorigdstport 1026 -s 10.66.16.137 -j RETURN
                   iptables -A DOCKER-USER -i ens2 -p tcp -m tcp -m conntrack --ctorigdstport 8088 -s 10.66.16.137 -j RETURN
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
```


## Installation

### Private registry docker.pixel-ports.eu
login in docker private registry !!!!
```
cat docker.password | docker login --username pixel --password-stdin docker.pixel-ports.eu
```
docker.password is not provide

### Installation process

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

And ```docker ps -a``` should show all containers working excepted ```dal-provisiong``` that run only once

```docker logs dal-provisioning``` display useful information to install ```PUBLIC``` server.

It should display something like that
```

> provisioning@1.0.0 start /app
> node index.js

Token                           : 99f4bf97-e915-417b-9285-09023905a491
Organization PIXEL              : 96a7da6e-1bbc-4ee3-aee8-dacab079d485
Appli DAL NGSIAGENTS PROXY      : 5ff34b1c-4e41-4b2e-9085-0f52b0b1c810
PEP Proxy password              : pep_proxy_6c7b2771-1704-42c1-ab04-d8753401f3a2
PEP Proxy oauth_client_id       : 5fe89b1c-4e41-4b2e-9085-0f52b0b1c810
Keyrock         .............   Done
Subscription created            : 5ed36ccd502bffe0fedc6847
Inquisitor      .............   Done
```
