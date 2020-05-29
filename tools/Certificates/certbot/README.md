```certbot certonly --manual```

```openssl x509 -in cert.pem -text```

```docker run -it --rm $(PwD):/etc/letsencrypt --entrypoint certbot tools/certbot certonly --manual -m infos@pixel-ports.eu -d *.frbod.pixel-ports.eu```