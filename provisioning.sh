curl -X POST -H "X-Auth-Token: KV4R5spon2ZC" -H "Content-Type: application/json" http://172.41.1.3:8080/api/ngsiagents -d @- <<EOF 
{
    "name": "ngsiagent-frbod-tidsensor",
    "image": "pixelh2020/frbodtidesensor:1.0.0",
    "type": "scheduled",
    "scheduled": "22 * * * *",
    "datasources": [
        "urn:pixel:DataSource:frbod:TideSensorObserved"
    ],
    "datamodels": [
        "/Pixel/TideSensorObserved/schema.json"
    ],
    "environment": [
        {
            "key": "PATH",
            "value": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        },
        {
            "key": "NODE_VERSION",
            "value": "13.6.0"
        },
        {
            "key": "YARN_VERSION",
            "value": "1.21.1"
        },
        {
            "key": "NODE_TLS_REJECT_UNAUTHORIZED",
            "value": "0"
        },
        {
            "key": "ORION_URL",
            "value": "http://10.12.182.193:1026"
        },
        {
            "key": "NAMI_AUTH_URL",
            "value": "https://nami.bordeaux-port.fr/?q=accueil"
        },
        {
            "key": "NAMI_URL",
            "value": "https://nami.bordeaux-port.fr/hauteurs"
        },
        {
            "key": "NAMI_LOGIN",
            "value": "pim"
        },
        {
            "key": "NAMI_PASSWORD",
            "value": "pimpw"
        },
        {
            "key": "FIWARE_SERVICE="
        },
        {
            "key": "FIWARE_SERVICE_PATH="
        }
    ]
}
EOF
