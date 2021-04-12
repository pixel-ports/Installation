# HOPU Proxy

The purpose of this agent is to provide a proxy to access Orion API through the Security Layer deploy for the DAL.

The data are pushed using a different Service (or tenant) in Orion Database, so HOPU can't access PIXEL Data.

## Deploy the NGSI Agent

First you have to pull the docker image on the PUBLIC host: 
```
docker pull pixelh2020/ngsiagent-orion:1.0.0
```

Then you can deploy the agent using the Orchestrator API (you will need to retreive the docker/public/secrets/dal.orchestrator.api.token)

```
curl -X POST -H "Content-Type: application/json" -H "X-Auth-Token: <changeit>" http://172.41.1.3:8080/api/ngsiagent -d @- <<EOF
{
    "name": "/hopu-proxy",
    "image": "pixelh2020/ngsiagent-orion:1.0.0",
    "type": "daemon",
    "daemon": {
        "internal_port": "80",
        "internal_path": "/orion",
        "external_path": "/hopu/orion"
    },
    "datasources": [
        "urn:pixel:DataSource:hopu:raw"
    ],
    "datamodels": [
        "/Dummies/minimal-schema.json"
    ],
    "mode": "update",
    "environment": [
        {
            "key": "NGINX_HOST",
            "value": "0.0.0.0"
        },
        {
            "key": "NGINX_PORT",
            "value": "80"
        },
        {
            "key": "TARGET",
            "value": "10.12.182.193:1026"
        },
        {
            "key": "FIWARE_SERVICE_PATH",
            "value": "/"
        },
        {
            "key": "FIWARE_SERVICE",
            "value": "hopu"
        },
        {
            "key": "PATH",
            "value": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        },
        {
            "key": "NGINX_VERSION",
            "value": "1.17.10"
        },
        {
            "key": "NJS_VERSION",
            "value": "0.3.9"
        },
        {
            "key": "PKG_RELEASE",
            "value": "1~buster"
        }
    ]
}
EOF
```

To check it is well deployed
```
curl http://172.43.1.2:8080/hopu/orion/version
```

Schould return this kind of result
```
{"orion":{"version":"2.4.0-next","uptime":"125 d, 22 h, 15 m, 55 s","git_hash":"4f26834ca928e468b091729d93dabd22108a2690","compile_time":"Tue Mar 31 15:41:02 UTC 2020","compiled_by":"root","compiled_in":"d99d1dbb4d9e","release_date":"Tue Mar 31 15:41:02 UTC
```

## Create the account with appropriate right on keyrock
