read -p "Are you sure ? Everything will be uninstall (Y)es / (N)o : " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo 'uninstall will start in 10s (Ctrl+C to cancel)'
    sleep 10
    echo Uninstall ...
    echo ... Stoping containers
    docker-compose -f docker-compose.yaml -f docker-compose-security.yaml -f docker-compose-elastic.yaml -f docker-compose-ih.yaml -f docker-compose-tools.yaml -f docker-compose-ot.yaml stop
    echo ... Removing containers
    docker-compose -f docker-compose.yaml -f docker-compose-security.yaml -f docker-compose-elastic.yaml -f docker-compose-ih.yaml -f docker-compose-tools.yaml -f docker-compose-ot.yaml rm
    echo ... Stoping and Removing Dal containers
    docker-compose -f docker-compose.yaml -f docker-compose-security.yaml -f docker-compose-elastic.yaml -f docker-compose-ih.yaml -f docker-compose-tools.yaml -f docker-compose-ot.yaml  -f docker-compose-dal-provisioning.yaml down
    echo ... Removing networks
    docker network prune 
    echo ... Prune the unused volumes
    docker volume prune
fi