#!/bin/bash
PUBLIC_INTERFACE=ens2
source .env
echo iptables -A INPUT -i ${PUBLIC_INTERFACE} -m conntrack --ctstate ESTABLISHED -j ACCEPT
echo iptables -A INPUT -p udp -i lo -s 127.0.0.1/24 -j ACCEPT
echo iptables -A INPUT -p tcp -i lo -s 127.0.0.1/24 -j ACCEPT
echo iptables -A INPUT -p tcp -i ${PUBLIC_INTERFACE} --dport ssh -j ACCEPT
echo iptables -A INPUT -p tcp -i ${PUBLIC_INTERFACE} -s ${PUBLIC_HOST_IP} --dport 3000 -j ACCEPT
echo iptables -A INPUT -p tcp -i ${PUBLIC_INTERFACE} -s ${PUBLIC_HOST_IP} --dport 3080 -j ACCEPT
echo iptables -A INPUT -p tcp -i ${PUBLIC_INTERFACE} -s ${PUBLIC_HOST_IP} --dport 1026 -j ACCEPT
echo iptables -P INPUT DROP
echo iptables -I FORWARD -p tcp --dport 9092 -d 172.24.1.14 -j DROP
echo iptables -I FORWARD '!' -s ${PUBLIC_HOST_IP} -p tcp --dport 1026 -d 172.28.1.10 -j DROP
echo iptables -I FORWARD '!' -s ${PUBLIC_HOST_IP} -p tcp --dport 1026 -d 172.27.1.10 -j DROP
echo iptables -I FORWARD '!' -s ${PUBLIC_HOST_IP} -p tcp --dport 3000 -d 172.26.1.6 -j DROP
echo iptables -I FORWARD '!' -s ${PUBLIC_HOST_IP} -p tcp --dport 3000 -d 172.23.1.6 -j DROP
echo iptables -I FORWARD '!' -s ${PUBLIC_HOST_IP} -p tcp --dport 8080 -d 172.26.1.8 -j DROP
echo
echo "  / \\"
echo " / | \\"
echo "/  *  \\"
echo "-------"
echo ""
echo "Test everything is still working before executing the next command"
echo "All the previous rules will be deleted after reboot, until you execute the next one"
echo "/!\ : apt-get install iptables-persistent"