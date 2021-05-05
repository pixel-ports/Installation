FROM eclipse-mosquitto
COPY mosquitto.conf /mosquitto/config/
RUN mkdir -p /mosquitto/ssl/
COPY broker.crt /mosquitto/ssl/
COPY broker.key /mosquitto/ssl/
COPY ca.crt /mosquitto/ssl/