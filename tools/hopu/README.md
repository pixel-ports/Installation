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
                    "id": "48c32491-3fd7-4a47-9f40-2a8e0b566ccf",
                    "username": "hopu",
                    "email": "hopu@pixel-ports.eu",
                    "enabled": true,
                    "admin": false,
                    "image": "default",
                    "gravatar": false,
                    "date_password": "2021-04-15T12:51:00.000Z",
                    "description": null,
                    "website": null,
                    "password": "hk0dnY3G5BYyrNQP",
                    "roles": [
                        "hopu"
                    ],
                    "token": "8d288a94a5278b50dbf0b9c35503c46d6afad678"
                }
            }
(...)
```

You will retreive here :
* user login  : hopu@pixel-ports.eu
* user password (will be set automatically with random value): (here : hk0dnY3G5BYyrNQP)
* access_token (permanent): 8d288a94a5278b50dbf0b9c35503c46d6afad678

You will be then be able to make a simple 

```
curl -H "X-Auth-Token: 8d288a94a5278b50dbf0b9c35503c46d6afad678" https://dal.int2.pixel-ports.eu/hopu/orion/version
```

