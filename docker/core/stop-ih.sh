#!/bin/bash

# STOP ALL IH CONTAINERS
read -p "Stop ALL Information Hub containers ? " -n 1 -r
echo  ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker stop core_orion-collector_1 core_monitor_1 core_writer_1 core_extractor_1 core_orchestrator_1 core_controller_1 core_elasticsearch-proxy_1 kafka zookeeper 
    echo "done"
fi


# REMOVE ALL IH CONTAINERS
read -p "Remove ALL Information Hub containers ? " -n 1 -r
echo  ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker rm core_orion-collector_1 core_monitor_1 core_writer_1 core_extractor_1 core_orchestrator_1 core_controller_1 core_elasticsearch-proxy_1 kafka zookeeper 
    echo "done"
fi
