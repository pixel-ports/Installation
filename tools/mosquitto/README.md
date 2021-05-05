# create the certificate

## Authority
```
openssl req -new -x509 -days 365 -extensions v3_ca -keyout ca.key -out ca.crt
```

## Broker
```
openssl genrsa -out broker.key 2048
openssl req -config broker.cfg  -out broker.csr -key broker.key -new
openssl x509 -req -in broker.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out broker.crt -days 365
```

## Client
```
openssl genrsa -out client.key 2048
openssl req -config client.cfg -out client.csr -key client.key -new
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 365

```

p1x3l!

```
docker run -v $(PWD):/mosquitto/ssl --link mosquitto -it --rm eclipse-mosquitto  mosquitto_pub -p 8883 --cafile /mosquitto/ssl/ca.crt --cert /mosquitto/ssl/client.crt --key /mosquitto/ssl/client.key -h mosquitto -m hello -t /world

docker run -v $(PWD):/mosquitto/ssl -it --rm --link mosquitto eclipse-mosquitto  mosquitto_pub -p 1883 -h mosquitto  -m hello -t /world
```

openssl req -new -x509 -days 365 -extensions v3_ca -keyout catest.key -out catest.crt
openssl x509 -req -in client.csr -CA catest.crt -CAkey catest.key -CAcreateserial -out client2.crt -days 360

docker run -v $(PWD):/mosquitto/ssl --link mosquitto -it --rm eclipse-mosquitto  mosquitto_pub -p 8883 --cafile /mosquitto/ssl/ca.crt --cert /mosquitto/ssl/client2.crt --key /mosquitto/ssl/client.key -h mosquitto -m hello -t /world