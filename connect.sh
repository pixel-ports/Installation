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
        *)
            echo "CORE    212.47.227.23   - 10.12.182.193"
            echo "PUBLIC  163.172.188.163 - 10.66.16.137"
            ;;
esac