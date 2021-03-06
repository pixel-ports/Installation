# Install Pixel Core Components

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
echo "vm.max_map_count=262144" >> /etc/sysctl.conf
sysctl -w vm.max_map_count=262144
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
curl -L "https://github.com/docker/compose/releases/download/1.28.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
yum install git
echo "vm.max_map_count=262144" >> /etc/sysctl.conf
sysctl -w vm.max_map_count=262144
```

### ALL OS

```bash
systemctl enable docker
systemctl start docker
```

## Retrieve the Core Archive

Install the core archive in /opt/pixel

```bash
mkdir -p /opt/pixel
cd /opt/pixel
```

```bash
git clone https://github.com/pixel-ports/Installation.git
```

Later you can just run git pull to update

```bash
git pull
```

then go to the Core folder

```bash
cd /opt/pixel/Installation/docker/core
```

## Configure the scripts

This part is easy :

Create the ```.env``` to set the IP of the two servers.

```bash
cp .env.template .env
```

Then edit ```.env```

```bash
PUBLIC_HOST_IP=10.66.16.137
CORE_HOST_IP=10.12.182.193
PIXEL_DOMAIN=.frbod.pixel-ports.eu
PIXEL_INTERNAL_DOMAIN=.pixel.internal
```

You can now run ```hosts.install.sh```to install local hostname used for configuration
Check ```/etc/hosts```to check the result

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

## Network security (if needed)

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

```bash
cp pixel-rules /etc/init.d
/etc/init.d/pixel-rules start
```

If something go south and you are kick out the server, reboot it, default rules should be reinstall

if it works as expected, auto-start the script

```bash
update-rc.d pixel-rules defaults
```

## Installation

### Installation process

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
Creating core_webapp_1                  ... done
Creating dal-orion-db                   ... done
Creating dashboard-kibana               ... done
Creating core_elastalert_1              ... done
Creating sec-mysql-db                   ... done
Creating core_elasticsearch_1           ... done
Creating datarepo                       ... done
Creating otdb                           ... done
Creating nagios                         ... done
Creating sec-authzforce                 ... done
Creating zookeeper                      ... done
Creating dashboard-api-db               ... done
Creating core_dal-orion_1               ... done
Creating sec-keyrock                    ... done
Creating core_elasticsearch-proxy_1     ... done
Creating core_kibana_1                  ... done
Creating ot-core                        ... done
Creating kafka                          ... done
Creating dashboard-api                  ... done
Creating dal-inquisitor                 ... done
Creating core_extractor_1               ... done
Creating core_writer_1                  ... done
Creating core_orion-collector_1         ... done
Creating core_orchestrator_1            ... done
Creating core_controller_1              ... done
Creating dashboard                      ... done
Creating internal-proxy                 ... done
Creating core_monitor_1                 ... done
```

And ```docker ps -a``` should show all containers working

### DAL-Provisioning

Run ```./dal-provisioning.sh``` display useful information to install ```PUBLIC``` server.

It should display something like that

```bash
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

#### Dashboard config

Now you must create the OAUTH APP, the user and roles that will use the dashboard. This has to be done manually for now, it is expected to be automated in the future. To create these applications you must access to KeyRock so you can access directly if you have access to the IP and KeyRock port of the CORE machine or if not you must start and finish the installation of [Public Components](../public/README.md) and continue here (this way we can access to [https://id.EXAMPLE.pixel-ports.eu](https://id.EXAMPLE.pixel-ports.eu) and create the dashboard configuration correctly)

1 - We created the new application from the KeyRock interface

![1](../../dashboard-config-1.png)

2 - We fill out the form as shown in the image substituting our domain

![2](../../dashboard-config-2.png)

3 - We give you to add roles

![3](../../dashboard-config-3.png)

4 - We add the roles `viewer` and `admin`

![4](../../dashboard-config-4.png)

5 - We create the admin user for the API and give him administration permissions

![5](../../dashboard-config-5.png)

![5.2](../../dashboard-config-5.2.png)

6 - We set the client OAUTH as you see in the image and note Client_ID and Client_SECRET

![6](../../dashboard-config-6.png)

7 - We added the admin user to the app with all roles

![7](../../dashboard-config-7.png)

Edit `.env` again with the client_ID and CLient_KEY from step 6 and the user PIXEL_DASHBOARD_ADMIN_EMAIL from step 5. Edit `./secrets/dashboard.admin.secret` with the password from step 5 and run `./build.sh` and `./install.sh`

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
