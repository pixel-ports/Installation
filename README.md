# PIXEL Installation Guidelines

This repository provide the documentation and resources to deploy a [PIXEL](https://pixel-ports.eu) platform on 2 servers using docker-compose

It is recommended to use Ubuntu servers but as long as it is Linux 64bit servers with docker and docker-compose the process should works.

We use 2 servers for the installation :

* PUBLIC : That contains the componenets exposed outside and Data Acquisition Layer
* CORE : That contains the core PIXEL components

## The components

![alt text](./technical-architecture.png "Technical Architecture Diagram")

## DNS Configuration

In order to expose the PIXEL services you need to create several DNS Entries
If your domain is ```${PIXEL_DOMAIN}``` and public Host IP is ```${PUBLIC_IP}``` you have to create :

```bash
dashboard${PIXEL_DOMAIN}.       A ${PUBLIC_IP}
api-dashboard${PIXEL_DOMAIN}.   A ${PUBLIC_IP}
id${PIXEL_DOMAIN}.              A ${PUBLIC_IP}
dal${PIXEL_DOMAIN}.             A ${PUBLIC_IP}
data${PIXEL_DOMAIN}.            A ${PUBLIC_IP}
api-ot${PIXEL_DOMAIN}.          A ${PUBLIC_IP}
ot${PIXEL_DOMAIN}.              A ${PUBLIC_IP}
admin${PIXEL_DOMAIN}.           A ${PUBLIC_IP}
```

For example for Bordeaux the domain is ```.frbod.pixel-ports.eu```and the public IP is ```163.172.188.163```

So the DNS configuration is :

```bash
dashboard.frbod.pixel-ports.eu.       A 163.172.188.163
api-dashboard.frbod.pixel-ports.eu.   A 163.172.188.163
id.frbod.pixel-ports.eu.              A 163.172.188.163
dal.frbod.pixel-ports.eu.             A 163.172.188.163
data.frbod.pixel-ports.eu.            A 163.172.188.163
api-ot.frbod.pixel-ports.eu.          A 163.172.188.163
ot.frbod.pixel-ports.eu.              A 163.172.188.163
admin.frbod.pixel-ports.eu.           A 163.172.188.163
```

## Network Flow

Depending of your infrastructure rules, keep ```SSH``` access to both hosts.
All the component are manage using ```container``` the container that need to be accessible outside its hosts expose ports on the hosts.
Most of the component, at least for installation, need to be able to access external ressources

### From Internet

Only the PUBLIC host need external access on port TCP ```80``` and ```443```
The component that manage those port is ```frontrp```

### From PUBLIC to CORE

* NGSI Agents need to access
  * ```TCP 1026```(orion)
* FRONT RP need to access
  * ```TCP 8081``` dashboad
  * ```TCP 3060``` api-dashboard
  * ```TCP 3000``` keyrock
  * ```TCP 443``` internal-proxy
  * ```TCP 8080``` ot-core
  * ```TCP 5602``` kibana
  * ```TCP 8088``` nagios
* WILMA need access
  * ```TCP 3000``` keyrock
  * ```TCP 3080``` Authzforce

### From CORE to PUBLIC

* internal_proxy need to access
  * ```TCP 8080``` dal-orchestrator

## Installation process

The installation use ```docker-compose```

1. Install the [Core Components](docker/core/README.md)
2. Install the [Public Components](docker/public/README.md)
