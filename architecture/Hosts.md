# List of Containers Predifined IP

## Public Host

| Container           | proxy        | dal          | dal_agents   | dal_proxy    | 
| ------------------- |:------------:|:------------:|:------------:|:------------:|
| frontrp             | 172.40.1.5   |              |              |              |
| sec-wilma-pub       | 172.40.1.4   |              |              | 172.43.1.4   |
| dal-proxy           |              | 172.41.1.2   | 172.42.1.2   | 172.43.1.2   |
| dal-orchestrator    |              | 172.41.1.3   |              |              |
| nagios              | 172.40.1.200 | 172.41.1.200 | 172.42.1.200 | 172.43.1.200 |


## Core Host

| Container           | ih_public    | ih           | security     | security_db  | dal          | dal_db       | pixel        | ot           | dash-api-db  |
| ------------------- |:------------:|:------------:|:------------:|:------------:|:------------:|:------------:|:------------:|:------------:|:------------:|
| internal_proxy      | 172.25.1.5   |              | 172.26.1.5   |              |              |              | 172.29.1.5   |              |              |
| sec-keyrock         |              |              | 172.26.1.6   | 172.23.1.6   |              |              |              |              |              |
| sec-mysql-db        |              |              |              | 172.23.1.7   |              |              |              |              |              |
| sec-authzforce      |              |              | 172.26.1.8   |              |              |              |              |              |              |
| dal-orion-db        |              |              |              |              |              | 172.27.1.9   |              |              |              |
| dal-orion           |              |              |              |              | 172.28.1.10  | 172.27.1.10  |              |              |              |
| dal-inquisitor      |              |              |              |              | 172.28.1.21  |              |              |              |              |
| elasticsearch       |              | 172.24.1.11  |              |              |              |              |              |              |              |
| kibana              |              | 172.24.1.12  |              |              |              |              |              |              |              |
| zookeeper           |              | 172.24.1.13  |              |              |              |              |              |              |              |
| kafka               |              | 172.24.1.14  |              |              |              |              |              |              |              |
| orion-collector     |              | 172.24.1.15  |              |              | 172.28.1.15  |              |              |              |              |
| controller          |              | 172.24.1.16  |              |              |              |              |              |              |              |
| extractor           | 172.25.1.17  | 172.24.1.17  |              |              |              |              |              |              |              |
| monitor             |              | 172.24.1.18  |              |              |              |              |              |              |              |
| writer              |              | 172.24.1.19  |              |              |              |              |              |              |              |
| elasticsearch-proxy | 172.25.1.20  | 172.24.1.20  |              |              |              |              |              |              |              |
| otdb                |              |              |              |              |              |              |              | 172.30.1.22  |              |
| dashboard-kibana    |              | 172.24.1.23  |              |              |              |              |              |              |              |
| dashboard-api-db    |              |              |              |              |              |              |              |              | 172.31.1.24  |
| dashboard-api       | 172.25.1.25  |              |              |              |              |              |              |              | 172.31.1.25  |
| dashboard           | 172.25.1.28  |              |              |              |              |              |              |              |              |
| elastalert          |              | 172.31.1.26  |              |              |              |              |              |              |              |
| webapp              |              | 172.31.1.27  |              |              |              |              |              |              |              |
| nagios              | 172.25.1.200 | 172.24.1.200 | 172.26.1.200 | 172.23.1.200 | 172.28.1.200 | 172.27.1.200 | 172.29.1.200 | 172.30.1.200 | 172.31.1.200 |
| dal-provisioning    |              |              | 172.26.1.201 |              | 172.28.1.201 |              |              |              |              |


## Listening Port


### Core

| Container           | host         | container    | 
| ------------------- |:------------:|:------------:|
| internal_proxy      |      443     |     443      | 
| sec-keyrock         |     3000     |    3000      | 
| sec-mysql-db        |              |    3306      | 
| sec-authzforce      |     3080     |    8080      | 
| dal-orion-db        |              |   27017      | 
| dal-orion           |     1026     |     1026     | 
| dal-inquisitor      |              |     8080     | 
| elasticsearch       |              |     9200     | 
| core_kibana_1       |      5602    |     5601     | 
| zookeeper           |      2181    |     2181     | 
| kafka               |      9092    |     9092     | 
| orion-collector     |              |              | 
| controller          |              |              | 
| extractor           |              |              | 
| monitor             |              |              | 
| writer              |              |              | 
| elasticsearch-proxy |              |      80      | 
| otdb                |     27017    |    27017     | 
| dashboard-kibana    |     5601     |    5601      | 
| dashboard-api-db    |              |    27017     | 
| dashboard-api       |     3060     |     3000     | 
| dashboard           |     8081     |     8080     | 
| elastalert          |              |     3030     | 
| webapp              |     8085     |     8080     | 
| nagios              |     8088     |       80     | 
| dal-provisioning    |              |              | 
| ot                  |     8080     |              | 