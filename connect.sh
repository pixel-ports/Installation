#!/bin/bash
keypass=/Users/marcdespland/Projects/work/Pixel
case "$1" in
        core)
            exec ssh -i $keypass/gpmb_private root@212.47.227.23
            ;;
        public)
            exec ssh -i $keypass/gpmb_private root@163.172.188.163
            ;;
        public-nagios)
            ssh -i $keypass/gpmb_private -L 127.0.0.1:8088:10.12.182.193:8088 root@163.172.188.163
            ;;
        core-ot)
            ssh -i $keypass/gpmb_private -L 127.0.0.1:8089:127.0.0.1:8080 root@212.47.227.23
            ;;
       *)
            echo "CORE    212.47.227.23   - 10.12.182.193"
            echo "PUBLIC  163.172.188.163 - 10.66.16.137"
            echo
            echo ./connect.sh core : Connect to core server
            echo ./connect.sh public : Connect to public server
            echo ./connect.sh public-nagios : Connect to public with Tunnel for nagios http://127.0.0.1:8088/nagios
            echo ./connect.sh core-ot : Connect to core with Tunnel for OT http://127.0.0.1:8089/ui
            ;;
esac