#!/usr/bin/python3

import sys
import time

import docker
import requests

VERSION = 1.2

"""
Works with any Python3 version that should be installed with your OS
You need to install pip3 the Python package manager : apt-get install pip3
Then you can install dependencies : pip3 install docker requests

Run : python3 resetds.py --help
"""


def main(srctype: str,
         srcname: str,
         delete_subscr: bool = False,
         fiware_service: str = None,
         fiware_service_path: str = None
         ):
    print("\n# Damjan's procedure to delete the source through IH API")
    print("Retrieve IH container IP address")
    client = docker.from_env()
    cntr_ih = client.containers.get("core_controller_1")
    ipaddr = cntr_ih.attrs['NetworkSettings']['Networks']['core_ih']['IPAddress']
    print(f"IP address found : {ipaddr}")

    baseurl = f"http://{ipaddr}:8015/archivingSystem/context/v1/sourceType/{srctype}/source/{srcname}"
    print("Deactivate the datasource (stop collecting data)")
    r = requests.put(baseurl, json={"collected": False, "archived": False})
    print("Success" if r.ok else f"Failed : {r.reason}")
    time.sleep(1)

    print("Delete the datasource")
    r = requests.delete(baseurl)
    print("Success" if r.ok else f"Failed : {r.reason}")
    time.sleep(1)

    print("Delete the source type")
    baseurl = baseurl.split("/source/")[0]
    r = requests.delete(baseurl)
    print("Success" if r.ok else f"Failed : {r.reason}")
    time.sleep(1)

    orion_headers = {}
    if fiware_service:
        orion_headers["Fiware-Service"] = fiware_service
    if fiware_service_path:
        orion_headers["Fiware-ServicePath"] = fiware_service_path

    if delete_subscr:
        print(f"Looking for existing IH subscription to Orion datasource {srcname}")
        baseurl = "http://127.0.0.1:1026/v2"
        url = f"{baseurl}/subscriptions"
        r = requests.get(url, headers=orion_headers)
        if r.ok:
            print("Success")
        else:
            print(f"Failed : {r.reason}")
            sys.exit(1)

        subscriptions = [x for x in r.json() if x['description'] ==
                         f"Information Hub subscription to the source {srcname}."]
        if not subscriptions:
            print("Existing subscription has not been found.")
        elif len(subscriptions) > 1:
            print("Too many subscriptions found !!!!")
            print(subscriptions)
            sys.exit(6)
        else:
            subscr = subscriptions[0]
            subscr_id = subscr["id"]
            print("Subscription found: " + subscr_id)
            print("Delete the Orion subsciption")
            subscr_id = subscr["id"]
            r = requests.delete(f"{url}/{subscr_id}", headers=orion_headers)
            if r.ok:
                print(f"Successfully deleted subscription {subscr_id}")
            else:
                print(f"Failed : {r.reason}")
                sys.exit(1)

    print("\n# Marc's procedure to force detection of a datasource through Orion")
    print("Note: the datasource has been created through the DAL Orchestrator at the agent creation time")
    baseurl = "http://127.0.0.1:1026/v2"
    url = f"{baseurl}/entities/{srcname}"
    print(
        f"Retrieve the datasource entity {srcname} from Orion and store payload")
    r = requests.get(url, headers=orion_headers)
    print("Success" if r.ok else f"Failed : {r.reason}")
    if not r.ok:
        print("Missing datasource. You should use DAL Orchestrator to register the corresponding NGSI Agent")
        sys.exit(3)
    payload = r.json()
    print("payload = " + str(payload))
    print("Delete the datasource entity in Orion")
    r = requests.delete(url, headers=orion_headers)
    print("Success" if r.ok else f"Failed : {r.reason}")
    print("Re-create the entity as-is (same payload)")
    r = requests.post(f"{baseurl}/entities", json=payload, headers=orion_headers)
    print("Success" if r.ok else f"Failed : {r.reason}")
    if not r.ok:
        sys.exit(4)
    time.sleep(2.5)

    print("\n# Check if datasource has been registered successfully")
    print(
        f"Check there's an IH subscription to Orion for datasource {srcname}")
    url = f"{baseurl}/subscriptions"
    r = requests.get(url, headers=orion_headers)
    subscriptions = [x for x in r.json() if x['description'] ==
                     f"Information Hub subscription to the source {srcname}."]
    if not subscriptions:
        print("Subscription has not been found!")
        if delete_subscr:
            print("Note: importing the historical data might take some time.")
        sys.exit(1)
    elif len(subscriptions) > 1:
        print("Too many subscriptions found !!!!")
        print(subscriptions)
        sys.exit(6)
    else:
        subscr = subscriptions[0]
        print(f"Orion subscription found: {subscr['id']}. Status: {subscr['status']}")
        if subscr['status']:
            print(f"Datasource {srcname} has been re-registered successfully.")


def help():
    print(
        "Usage : resetds <sourceType> <sourceName> [--delete-subscr] [--fiware-service=<value>] [--fiware-service-path=<value>]")
    print("Usage : resetds --help")
    print("Usage : resetds --version")
    print("Chain Damjan and Marc procedures to respectively :")
    print("  - delete a datasource through IH API")
    print("  - force detection of a datasource through Orion")
    print("Use this script when data are stored in Orion but doesn't reach the Information Hub")
    print("Example : resetds AirQualityObserved urn:pixel:DataSource:frbod:AtmoNouvelleAquitaine")

    print("Options:")
    print(
        "  --delete-subscr: delete data source subscription in Orion. Consequently, the IH will reimport historical data from Orion when data source is re-registered in IH. Use this switch if you have also deleted data source index in Elasticsearch.")
    print("  --fiware-service=<value>: use specified Fiware-Service header when calling Orion")
    print("  --fiware-service-path=<value>: use specified Fiware-ServicePath header when calling Orion")


if __name__ == "__main__":
    opts = [opt for opt in sys.argv[1:] if opt.startswith("-")]
    args = [arg for arg in sys.argv[1:] if not arg.startswith("-")]
    delete_subscr = None
    fiware_service = None
    fiware_service_path = None

    for opt in opts:
        if opt == "-h" or opt == "--help":
            help()
            sys.exit(0)
        elif opt == "-V" or opt == "--version":
            print(f"{sys.argv[0]} version {VERSION}")
            sys.exit(0)
        elif opt == "--delete-subscr":
            delete_subscr = True
        elif opt.startswith("--fiware-service="):
            fiware_service = opt[len("--fiware-service="):]
        elif opt.startswith("--fiware-service-path="):
            fiware_service_path = opt[len("--fiware-service-path="):]
        else:
            print(f"Invalid option: {opt}")
            print()
            help()
            sys.exit(0)

    if not args or len(args) != 2:
        help()
        sys.exit(1)
    if not args[1].startswith("urn:"):
        print("Invalid source name. Source names MUST begin with 'urn:'")
        sys.exit(2)

    srctype = args[0]
    srcname = args[1]

    main(srctype, srcname, delete_subscr, fiware_service, fiware_service_path)
