#!/usr/bin/python3

import sys
import time
import docker
import requests

VERSION = 1.0

"""
Works with any Python3 version that should be installed with your OS
You need to install pip3 the Python package manager : apt-get install pip3
Then you can install dependencies : pip3 install docker requests

Run : python3 resetds.py --help
"""

def main(srctype: str, srcname: str):
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
    print("Delete the datasource")
    r = requests.delete(baseurl)
    print("Success" if r.ok else f"Failed : {r.reason}")
    print("Delete the source type")
    baseurl = baseurl.split("/source/")[0]
    r = requests.delete(baseurl)
    print("Success" if r.ok else f"Failed : {r.reason}")
    time.sleep(1)

    print("\n# Marc's procedure to force detection of a datasource through Orion")
    print("Note: the datasource has been created through the DAL Orchestrator at the agent creation time")
    baseurl = "http://127.0.0.1:1026/v2"
    url = f"{baseurl}/entities/{srcname}"
    print(
        f"Retrieve the datasource entity {srcname} from Orion and store payload")
    r = requests.get(url)
    print("Success" if r.ok else f"Failed : {r.reason}")
    if not r.ok:
        print("Missing datasource. You should use DAL Orchestrator to register the corresponding NGSI Agent")
        sys.exit(3)
    payload = r.json()
    print("payload = " + str(payload))
    print("Delete the datasource entity in Orion")
    r = requests.delete(url)
    print("Success" if r.ok else f"Failed : {r.reason}")
    print("Re-create the entity as-is (same payload)")
    r = requests.post(f"{baseurl}/entities", json=payload)
    print("Success" if r.ok else f"Failed : {r.reason}")
    if not r.ok:
        sys.exit(4)
    time.sleep(1)

    print("\n# Check IH process work properly")
    print(
        f"Check there's an IH subscription to Orion for datasource {srcname}")
    url = f"{baseurl}/subscriptions"
    r = requests.get(url)
    print("Success" if r.ok else f"Failed : {r.reason}")
    subscriptions = [x for x in r.json() if x['description'] ==
                     f"Information Hub subscription to the source {srcname}."]
    if not subscriptions:
        print("Subscription not found !!!!")
        sys.exit(5)
    if len(subscriptions) > 1:
        print("Too many subscriptions found !!!!")
        print(subscriptions)
        sys.exit(6)
    subscr = subscriptions[0]
    print("subscr = " + str(subscr))
    if subscr["status"] != "active":
        print("Subsciption found but not active !!!!")
        print("Try to activate the subsciption")
        id = subscr["id"]
        r = requests.patch(f"{url}/{id}", json={"status": "active"})
        print("Successful patch request" if r.ok else f"Failed : {r.reason}")
        time.sleep(1)
        # check ativation
        if not r.ok:
            sys.exit(7)
        r = requests.get(f"{url}/{id}")
        print("Successful get request" if r.ok else f"Failed : {r.reason}")
        if not r.ok:
            sys.exit(8)
        subscr = r.json()
        status = subscr["status"]
        if status != "active":
            print("Cannot activate subsciption !")
            sys.exit(9)
    print("subscr = " + str(subscr))
    print(
        "\n\033[1mSubscription found and active. It should work fine !\033[0m\n")
    sys.exit(0)


def help():
    print("Usage : resetds <sourceType> <sourceName>")
    print("Usage : resetds --help")
    print("Usage : resetds --version")
    print("Chain Damjan and Marc procedures to respectively :")
    print("  - delete a datasource through IH API")
    print("  - force detection of a datasource through Orion")
    print("Eventually check the IH subscription")
    print("Use this script when data are stored in Orion but doesn't reach the Information Hub")
    print("Example : resetds AirQualityObserved urn:pixel:DataSource:frbod:AtmoNouvelleAquitaine")


if __name__ == "__main__":
    opts = [opt for opt in sys.argv[1:] if opt.startswith("-")]
    args = [arg for arg in sys.argv[1:] if not arg.startswith("-")]
    if opts:
        if opts[0] == "-h" or opts[0] == "--help":
            help()
            sys.exit(0)
        if opts[0] == "-V" or opts[0] == "--version":
            print(f"{sys.argv[0]} version {VERSION}")
            sys.exit(0)            
    if not args or len(args) != 2:
        help()
        sys.exit(1)
    if not args[1].startswith("urn:"):
        print("Invalid source name. Source names MUST begin with 'urn:'")
        sys.exit(2)
    main(*args)
