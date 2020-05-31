read -p "Are you sure ? Everything will be unistall (Y)es / (N)o : " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo unistall will start in 10s (Ctrl+C to cancel)
    sleep 10
    echo Unistall ...
    echo ... Stoping containers
    docker-compose -f docker-compose.yaml stop
    echo ... Removing containers
    docker-compose -f docker-compose.yaml rm
    echo ... Removing networks
    docker network rm pixel dal dal_agents dal_proxy
    #echo ... Removing volumes
    #docker volume rm core_elasticsearch_data core_mysql-db core_orion-db core_zookeeper_data
    echo ... Prune the unused volumes
    docker volume prune
fi