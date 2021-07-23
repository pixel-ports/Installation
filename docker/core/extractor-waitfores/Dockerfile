FROM pixelh2020/information-hub-extractor:1.2.0
RUN apk update && apk add bash
COPY ./wait-for-it.sh /
RUN chmod u+rx /wait-for-it.sh
ENTRYPOINT [ "/wait-for-it.sh", "--host=elasticsearch", "--port=9200", "--timeout=120", "--", "java", "-Dlog4j.configurationFile=/etc/inf-hub/log4j2.xml", "-cp", "/opt/as/lib/*", "de.gsi.cs.co.sv.archiving.extractor.Extractor", "/etc/inf-hub/infhub.properties"  ]
