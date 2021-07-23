FROM pixelh2020/information-hub-monitor:1.2.0
RUN apk update && apk add bash
COPY ./wait-for-it.sh /
RUN chmod u+rx /wait-for-it.sh
ENTRYPOINT [ "/wait-for-it.sh", "--host=elasticsearch", "--port=9200", "--timeout=120", "--", "java", "-Dlog4j.configurationFile=/etc/inf-hub/log4j2.xml", "-cp", "/opt/as/lib/*", "de.gsi.cs.co.sv.archiving.monitor.MonitorService", "/etc/inf-hub/infhub.properties" ]
