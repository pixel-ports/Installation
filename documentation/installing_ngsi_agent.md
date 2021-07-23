# How to install/upgrade an NGSI agent

## Resources
* [NGSI AGent Cook Book](https://docs-hub-dal.readthedocs.io/en/latest/ngsiagent_cookbook/)
* You need an SSH access to the  ```PUBLIC``` host
* You need to know the DAL-Orchestrator API TOKEN : ```cat /opt/pixel/Installation/docker/public/secrets/dal.orchestrator.api.token```
* You need to know the CORE IP seeen from the PUBLIC host : ```cat /opt/pixel/Installation/docker/public/.env```

## Build the agent

Go on the source folder on the ```PUBLIC``` host
* INSIEL : ```cd /opt/pixel/Ngsi-agents/```
* FRBOD : ```cd /root/dev```

### Check the last version of the build image of the composant

We update the version of the docker image each time we deploy a new version to facilitate the rollback

```docker ps -a```

Here we will update ```ngsi-agent-pas-pei```

```a9015cf17f80        ngsi-agent-pas-pei:1.1.0                        "python main.py"         2 weeks ago         Exited (1) 11 days ago                                                                                       ngsi-agent-pas-pei```

So the version will be 1.1.1

### Build the new version

Configure your agent with a particular check of the following value
* Dockerfile : ```LABEL ngsiagent.extrahosts="[\"ih.pixel.internal:10.128.138.4\"]"``` with the CORE IP 
* constants.py : ```ES_IH_URL = "https://ih.pixel.internal/proxy/"```
* constants.py : ```RION_HOST = "10.128.138.4"```

```cd agent-pas-pei```

```docker build -t ngsi-agent-pas-pei:1.1.1 .```

Should end with something like
```Successfully built 41038f3f8bf1
Successfully tagged ngsi-agent-pas-pei:1.1.1````

### Deploy the new version

```cd /opt/pixel/Installation/docker/public```


* Run the backup script : ```./backup.sh````
The configuration of all currently deployed agents will be store here : ```cat /opt/pixel/backup/ngsiagents/<date>-<time>.ngsiagents.json```

* Retrieve the container id of the NGSI Agent
```curl -H "X-Auth-Token: 0NkcsOAlKYPi" http://172.41.1.3:8080/api/ngsiagent```
Here ```a9015cf17f8045e7bbc69b9a5f33904670ece97515c1c3419430b38de9556d9d```

* Remove the previous version of the agent
```curl -H "X-Auth-Token: <ORCHESTRATOR API TOKEN>" http://172.41.1.3:8080/api/ngsiagent/a9015-X DELETE http://172.41.1.3:8080/api/ngsiagent/<docker container id long>```

* Retrieve the new image ID
```curl -H "X-Auth-Token: <ORCHESTRATOR API TOKEN>" http://172.41.1.3:8080/api/ngsiagent/a9015http://172.41.1.3:8080/api/images```
Here ```sha256:41038f3f8bf1d3d6c10b2a58bc38873221f9449b591ee6739e730f59bd1090b2```

* Generate the template
```curl -H "X-Auth-Token: <ORCHESTRATOR API TOKEN>" http://172.41.1.3:8080/api/images/sha256:41038f3f8bf1d3d6c10b2a58bc38873221f9449b591ee6739e730f59bd1090b2/template```


```{"name":"/?[a-zA-Z0-9_-]+","image":"ngsi-agent-pas-pei:1.1.1","extrahosts":["ih.pixel.internal:10.128.138.4"],"type":"daemon","datasources":["urn:pixel:DataSource:KPI:EnvironmentalKeyPerformanceIndicator"],"datamodels":["/Pixel/KPI/EnvironmentalKeyPerformanceIndicator/schema.json"],"mode":"insert","environment":[{"key":"PATH","value":"/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"},{"key":"LANG","value":"C.UTF-8"},{"key":"GPG_KEY","value":"E3FF2839C048B25C084DEBE9B26995E310250568"},{"key":"PYTHON_VERSION","value":"3.9.5"},{"key":"PYTHON_PIP_VERSION","value":"21.1.1"},{"key":"PYTHON_GET_PIP_URL","value":"https://github.com/pypa/get-pip/raw/1954f15b3f102ace496a34a013ea76b061535bd2/public/get-pip.py"},{"key":"PYTHON_GET_PIP_SHA256","value":"f499d76e0149a673fb8246d88e116db589afbd291739bd84f2cd9a7bca7b6993"},{"key":"LC_ALL","value":"C.UTF-8"}]}```

You can override all parameters, but most of the time it is not a good idea, just change the name with ```/ngsi-agent-pas-pei``` (the ```/``` is mandatory) by convention I use the name of the image.

* Deploy the agent
```curl -X POST -H "Content-Type: application/json" -H "X-Auth-Token: 0NkcsOAlKYPi" http://172.41.1.3:8080/api/ngsiagent -d @- <<EOF
{"name":"/ngsi-agent-pas-pei","image":"ngsi-agent-pas-pei:1.1.1","extrahosts":["ih.pixel.internal:10.128.138.4"],"type":"daemon","datasources":["urn:pixel:DataSource:KPI:EnvironmentalKeyPerformanceIndicator"],"datamodels":["/Pixel/KPI/EnvironmentalKeyPerformanceIndicator/schema.json"],"mode":"insert","environment":[{"key":"PATH","value":"/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"},{"key":"LANG","value":"C.UTF-8"},{"key":"GPG_KEY","value":"E3FF2839C048B25C084DEBE9B26995E310250568"},{"key":"PYTHON_VERSION","value":"3.9.5"},{"key":"PYTHON_PIP_VERSION","value":"21.1.1"},{"key":"PYTHON_GET_PIP_URL","value":"https://github.com/pypa/get-pip/raw/1954f15b3f102ace496a34a013ea76b061535bd2/public/get-pip.py"},{"key":"PYTHON_GET_PIP_SHA256","value":"f499d76e0149a673fb8246d88e116db589afbd291739bd84f2cd9a7bca7b6993"},{"key":"LC_ALL","value":"C.UTF-8"}]}
EOF
```

Should return something like that : ```{"id":"8e15894911ab59082e20ffe4600edf4112aaeff3c36fc32f6dc33bbf1d7d57d4"}```

* Check the agent log
```docker logs 8e15894911ab59082e20ffe4600edf4112aaeff3c36fc32f6dc33bbf1d7d57d4```




