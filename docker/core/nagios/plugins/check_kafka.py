import sys, getopt
import kafka

def ok(message):
    print("OK - ", message)
    sys.exit(0)

def warning(message):
    print("WARNING - ", message)
    sys.exit(1)

def critical(message):
    print("CRITICAL - ",message)
    sys.exit(2)

def unknown(message):
    print("UNKNOWN - ",message)
    sys.exit(3)

def help():
    print("check_template -I <IP> -p <PORT>")

def main(argv):
    ip = ''
    port = ''
    try:
        opts, args = getopt.getopt(argv,"hI:p:u:d:s:c:")
    except getopt.GetoptError:
        help()
        sys.exit()
    for opt, arg in opts:
        if opt == '-h':
            help();
            sys.exit()
        elif opt in ("-I"):
            ip = arg
        elif opt in ("-p"):
            port = arg

    if not ip or not port:
        unknown("Missing parameters")
    else:
        try:
            consumer = kafka.KafkaConsumer(group_id='status', bootstrap_servers=[ip+":"+port])
            topics = consumer.topics()
            if not topics: 
                critical("Kafka not working") 
            else:
                ok("Kafka is working")
        except kafka.errors.NoBrokersAvailable as err:
            critical(err) 

if __name__ == "__main__":
    main(sys.argv[1:])
