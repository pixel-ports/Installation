| Version  | Date       | Author              | Description                                                                         |
|:--------:|:----------:|:-------------------:|-----------------------------------------------------------------------------------|
| 2.0.0    | 01/01/2021 | Marc Despland       | Initial Release   |
| 2.0.1    | 01/03/2021 | Marc Despland       | Add restart core_monitor_1 core_controller_1 in core install scripts   |
| 2.0.2    | 03/03/2021 | Marc Despland       | Add backup scripts for core and public   |
| 2.0.3    | 04/03/2021 | Damjan Murn         | push pixelh2020/information-hub-writer:1.2.1 Invalid data could cause infinite Loop |
| 2.0.4    | 05/03/2021 | Marc Despland       | Fix containers version in core/docker-compose-ih.yaml, 
|          |            |                     | remove core/docker-compose-ih-stop.yaml, rewrite stop-ih.sh |
|          |            |                     | fix nagios tests for frontrp (public host) |
|          |            |                     | remove exposition of data.xxxx.pixel-ports.eu on frontrp |
| 2.0.5    | 09/03/2021 | Marc + Damjan       | Modification of Elasticsearch to install ingest-attachment |
| 2.0.6    | 09/03/2021 | Marc Despland       | Change build order of FRONTRP to prevent apt issue with renew certificat |
| 2.0.7    | 09/03/2021 | J Martinez          | Update dashboard to version 2.1.5 |
| 2.0.8    | 09/03/2021 | J Martinez          | Update dashboard to version 2.1.6 |
| 2.0.9    | 10/03/2021 | Marc Despland       | Update DAL-Proxy to 1.1.1 to solve routes issue without end / |
| 2.0.10   | 12/03/2021 | J Martinez          | Update dashboard to version 2.2.0 and init all ports  |
| 2.0.11   | 12/03/2021 | Damjan Murn         | Update orion-data-collector to 1.5.2 - change text type to KEYWORD |
| 2.0.12   | 15/03/2021 | Marc Despland       | Update NAGIOS request to prevent wrong log |
| 2.0.13   | 23/03/2021 | J Martinez          | Update dashboard widgets |
| 2.0.14   | 24/03/2021 | Damjan Murn         | Update writer to 1.2.2 to solve issue when reseting source |
| 2.0.15   | 26/03/2021 | Benjamin Molina     | Update ot-core to 0.3 to solve bug detected with scheduledInstances |
| 2.0.16   | 7/04/2021  | J Martinez          | Update dashboard widgets table and map |
| 2.0.17   | 15/04/2021 | Marc Despland       | Add configuration to deploy ih-health-probe |
| 2.0.18   | 21/04/2021 | J Martinez          | Update dashboard widgets table and map |
| 2.0.19   | 27/04/2021 | J Martinez          | Update dashboard widgets |
| 2.0.20   | 28/04/2021 | Marc Despland       | Change dal-proxy to 1.1.1 to solve WasteTerminal bug |
| 2.0.21   | 14/05/2021 | Marc Despland       | Expose ES on admin host for INSIEL installation |
| 2.0.22   | 16/05/2021 | J Martinez          | Update dashboard to 2.8.0 and database of dashboard |
| 2.0.23   | 19/05/2021 | J Martinez          | Update dashboard to 2.8.1 and database of dashboard with backups |
| 2.0.24   | 19/05/2021 | J Martinez          | Update dashboard to 2.8.2 and database of dashboard with backups and fixes|
| 2.0.25   | 19/05/2021 | J Martinez          | Update dashboard to 2.8.3 renamed insiel and fix op tools menu|
| 2.0.26   | 25/05/2021 | Damjan Murn         | Update writer to 1.2.3 to solve loop issue, update proxy to 1.2.1 to solve INSIEL request |
| 2.0.27   | 26/05/2021 | Damjan Murn         | Update collector to 1.6 for geo:json and orion id management |
| 2.0.28   | 27/05/2021 | Marc Despland       | Update Orchestrator to 1.3.3 to manage extrahosts |
| 2.0.29   | 27/05/2021 | J Martinez          | Add CORS to fronrp - api-dahsboard and max_size_upload_file |
| 2.0.30   | 27/05/2021 | J Martinez          | Updated dashbaord to 2.8.7 |
| 2.0.31   | 28/05/2021 | Marc Despland       | Allow access to ES from admin |
| 2.0.32   | 28/05/2021 | Marc Despland       | Update dal-orchestrator and writer |
