# Backup Index

* Read the index mapping

```
curl http://172.24.1.11:9200/arh-lts-environmentalkeyperformanceindicator/_mapping
```

```
{"arh-lts-environmentalkeyperformanceindicator":{"mappings":{"dynamic_templates":[{"keyword_by_default":{"match_mapping_type":"string","mapping":{"type":"keyword"}}},{"disable_indexing":{"match":"data.*","mapping":{"index":false}}}],"properties":{"data":{"dynamic":"false","properties":{"calculationFrequency":{"type":"keyword","store":true},"calculationMethod":{"type":"keyword","store":true},"category":{"type":"keyword","store":true},"dataPieces":{"type":"object"},"dateModified":{"type":"date","store":true},"dateNextCalculation":{"type":"date","store":true},"dateObservedFrom":{"type":"date","store":true},"dateObservedTo":{"type":"date","store":true},"description":{"type":"keyword","store":true},"id":{"type":"keyword","store":true},"kpiValue":{"type":"float","store":true},"name":{"type":"keyword","store":true},"organization":{"type":"object"},"peicategory":{"type":"keyword","store":true},"peilevel":{"type":"keyword","store":true},"process":{"type":"keyword","store":true},"source":{"type":"keyword","store":true},"sourcePort":{"type":"keyword","store":true},"unit":{"type":"keyword","store":true}}},"links":{"type":"object"},"sourceId":{"type":"keyword"},"sourceRegId":{"type":"keyword"},"sourceTypeId":{"type":"keyword"},"timestamp":{"type":"date","store":true}}}}}
```

* Use the result to create the backup index

```
curl -X PUT --data '{"mappings":{"dynamic_templates":[{"keyword_by_default":{"match_mapping_type":"string","mapping":{"type":"keyword"}}},{"disable_indexing":{"match":"data.*","mapping":{"index":false}}}],"properties":{"data":{"dynamic":"false","properties":{"calculationFrequency":{"type":"keyword","store":true},"calculationMethod":{"type":"keyword","store":true},"category":{"type":"keyword","store":true},"dataPieces":{"type":"object"},"dateModified":{"type":"date","store":true},"dateNextCalculation":{"type":"date","store":true},"dateObservedFrom":{"type":"date","store":true},"dateObservedTo":{"type":"date","store":true},"description":{"type":"keyword","store":true},"id":{"type":"keyword","store":true},"kpiValue":{"type":"float","store":true},"name":{"type":"keyword","store":true},"organization":{"type":"object"},"peicategory":{"type":"keyword","store":true},"peilevel":{"type":"keyword","store":true},"process":{"type":"keyword","store":true},"source":{"type":"keyword","store":true},"sourcePort":{"type":"keyword","store":true},"unit":{"type":"keyword","store":true}}},"links":{"type":"object"},"sourceId":{"type":"keyword"},"sourceRegId":{"type":"keyword"},"sourceTypeId":{"type":"keyword"},"timestamp":{"type":"date","store":true}}}}' --header "Content-Type:application/json" http://172.24.1.11:9200/backup-arh-lts-environmentalkeyperformanceindicator
```

* Check the new index

```
curl http://172.24.1.11:9200/backup-arh-lts-environmentalkeyperformanceindicator/_mapping
```

* Copy the data

```
curl -X POST --data '{"source":{"index":"arh-lts-environmentalkeyperformanceindicator"},"dest":{"index":"backup-arh-lts-environmentalkeyperformanceindicator"}}' --header "Content-Type:application/json" http://172.24.1.11:9200/_reindex
```

```
{"took":13698,"timed_out":false,"total":95317,"updated":0,"created":95317,"deleted":0,"batches":96,"version_conflicts":0,"noops":0,"retries":{"bulk":0,"search":0},"throttled_millis":0,"requests_per_second":-1.0,"throttled_until_millis":0,"failures":[]}
```

* Check both index size ok

```
curl http://172.24.1.11:9200/arh-lts-environmentalkeyperformanceindicator/_count
```

```
curl http://172.24.1.11:9200/backup-arh-lts-environmentalkeyperformanceindicator/_count
```

The index has been backup

# Remove data in Orion and ElastickSearch for a type


All agent should be off during the operation

* Backup the index (doc here)
* Backup the database (run ./backup.sh on CORE)

* Retrieve the image to remove data in Orion

```
docker pull mdetools/orionremovetype
```

* Remove the data in Orion

```
docker run -it --rm --network core_dal mdetools/orionremovetype --orion http://dal-orion:1026 --type EnvironmentalKeyPerformanceIndicator
```

* Remove the index

```
curl -X DELETE http://172.24.1.11:9200/arh-lts-environmentalkeyperformanceindicator
```

* Rerun the agents
