# Prepare the machine
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


```
systemctl status docker
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
echo "vm.max_map_count=262144" >> /etc/sysctl.conf
sysctl -w vm.max_map_count=262144
```

```
systemctl status docker
```

# Iptables (if needed)

[Doc Ubunutu](https://doc.ubuntu-fr.org/iptables)

## Public
```
iptables -A INPUT -i ens2 -m conntrack --ctstate ESTABLISHED -j ACCEPT
iptables -A INPUT -p tcp -i ens2 --dport ssh -j ACCEPT
iptables -A INPUT -p tcp -i ens2 --dport 80 -j ACCEPT
iptables -A INPUT -p tcp -i ens2 --dport 443 -j ACCEPT
iptables -A INPUT -p tcp -i ens2 -s <IP CORE> --dport 8080 -j ACCEPT
iptables -P INPUT DROP
```

## Core
```
iptables -A INPUT -i ens2 -m conntrack --ctstate ESTABLISHED -j ACCEPT
iptables -A INPUT -p tcp -i ens2 --dport ssh -j ACCEPT
iptables -A INPUT -p tcp -i ens2 -s <IP PUBLIC> --dport 3000 -j ACCEPT
iptables -A INPUT -p tcp -i ens2 -s <IP PUBLIC> --dport 3080 -j ACCEPT
iptables -A INPUT -p tcp -i ens2 -s <IP PUBLIC> --dport 1026 -j ACCEPT
iptables -P INPUT DROP
```

# Configure Secrets
You can manualy configure each secrets, or just run the following command that will generate random data

```
docker run -it --rm -v ${PWD}/secrets:/app/secrets marcdespland/secrets
```