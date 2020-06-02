import sys, getopt
import mysql.connector


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
    print("check_template -I <IP> -p <PORT> -u <USER> -d <DATABASE> -s <SECRET>")

def main(argv):
    ip = ''
    port = ''
    user = ''
    database = ''
    secret = ''
    credential= ''
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
        elif opt in ("-u"):
            user = arg
        elif opt in ("-d"):
            database = arg
        elif opt in ("-s"):
            secret = arg
            try: 
                f = open(secret, 'r')
            except IOError:
                warning("Can't open secret file")
            else:
                credential=f.read()
                f.close()
        elif opt in ("-c"):
            credential = arg

    if not ip or not port or not user or not database or not credential :
        unknown("Missing parameters")
    else:
        try:
            cnx = mysql.connector.connect(host=ip, port=port,password=credential, user=user, database=database)
            cnx.close()
            ok("Server running : enable to connect on "+ip+" to database "+database+" with user "+user)
        except mysql.connector.Error as err:
            critical(err)  

if __name__ == "__main__":
    main(sys.argv[1:])
