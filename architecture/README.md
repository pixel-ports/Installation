# Prepare the machine

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

# Iptables

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