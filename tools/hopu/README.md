# HOPU Proxy

The purpose of this agent is to provide a proxy to access Orion API through the Security Layer deploy for the DAL.

The data are pushed using a different Service (or tenant) in Orion Database, so HOPU can't access PIXEL Data.

## On PUBLIC HOST

### Deploy the NGSI Agent
First you have to pull the docker image on the PUBLIC host: 
```
docker pull pixelh2020/ngsiagent-orion:1.0.0
```

Then you can deploy the agent using the Orchestrator API 

The ```configure.sh``` is here to help you with that task, it hill configured the json template and the deploy the agent using the Orchestrator API


```

cd /opt/pixel/Installation/tools/hopu
./configure.sh
```

To check it is well deployed
```
curl http://172.43.1.2:8080/hopu/orion/version
```

Schould return this kind of result
```
{"orion":{"version":"2.4.0-next","uptime":"125 d, 22 h, 15 m, 55 s","git_hash":"4f26834ca928e468b091729d93dabd22108a2690","compile_time":"Tue Mar 31 15:41:02 UTC 2020","compiled_by":"root","compiled_in":"d99d1dbb4d9e","release_date":"Tue Mar 31 15:41:02 UTC
```

## On CORE host

Create the ```hopu``` account on keyrock and add the needed permissions and roles to it

All the permissions and roles are described in the ```hopu-permisionns.json``` file and a script is available to automatically create them in Keyrock

On Core host : 
```
cd /opt/pixel/Installation/tools/hopu
./setpermission.sh
```

The file ```hopu-permisionns.json``` will be updated with the key informations

```
(...)
"users": {
                "hopu@pixel-ports.eu": {
                    "scope": [],
                    "id": "ef243a5c-a7a3-4bd6-a4e1-03df68572010",
                    "username": "hopu",
                    "email": "hopu@pixel-ports.eu",
                    "enabled": true,
                    "admin": false,
                    "image": "default",
                    "gravatar": false,
                    "date_password": "2021-04-15T09:15:16.000Z",
                    "description": null,
                    "website": null,
                    "password": "UeBBEHB4LjyHwuQz",
                    "roles": [
                        "hopu"
                    ],
                    "token": "886b52d83ba725a7463890c2b153d359579fde27"
                }
            }
(...)
```

You will retreive here :
* user login  : hopu@pixel-ports.eu
* user password (will be set automatically with random value): (here : UeBBEHB4LjyHwuQz)
* access_token (permanent): 886b52d83ba725a7463890c2b153d359579fde27

You will be then be able to make a simple 

```
curl -H "X-Auth-Token: " https://dal.int2.pixel-ports.eu/hopu/orion/version
```


