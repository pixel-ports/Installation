# Certificates signed with self-signed authority

Rather generating self-signed certificates, it's better to create your own certification authority and then to sign yourself your certificates.

This way you will be allow to add your authority on the list of trusted authority on the computer you use and you will be able to use your application just like they use "Verisigned Certificates".

## Creating a certification authority

It's really easy, just have to create a self-signed certificate :

```openssl req -new -x509 -keyout pixel.pem -out pixel.pem -days 3650```

Just answer the questions, use a passphrase for this one, it's important as it will be used to signed your other certificates.

That will generate two files :

* rootcert.pem : Your root certificate, the file you will have to add on client trusted root certificates store
* rootkey.pem : The privatekey. You will need it to sign new certificates (keep it secret)
Generate a private key[edit]

You can let openssl generate one for each certificate, but sometimes it's simple to use the same one for each certificates.

```openssl genrsa -des3 -out privatekey.pem 2048```

You can remove the pass phrase for this key

```openssl rsa -in privatekey.pem -out pixel.privatekey.pem```

## Generate a CSR

First you need to create a config file : pixel.internal.cnf

 ```
 [req]
 distinguished_name = req_distinguished_name
 #x509_extensions = v3_req
 req_extensions = v3_req
 
 prompt = no
 
 [req_distinguished_name]
 C = FR
 ST = FR
 L = FR
 O = PIXEL
 CN = *.pixel.internal
 
 [v3_req]
 #subjectKeyIdentifier = hash
 #authorityKeyIdentifier = keyid,issuer
 #basicConstraints = CA:TRUE
 basicConstraints = CA:FALSE
 keyUsage = nonRepudiation, digitalSignature, keyEncipherment
 subjectAltName = @alt_names
 
 [alt_names]
 DNS.1 = *.pixel.internal
 #DNS.2 =
 #DNS.3 = 
 ```

Be sure that the CN entry is also listed in [alt_names] and add a DNS.X for each DNS entry you want this certificate work with.

Then use openssl to generate the CSR:

```openssl req -config pixel.internal.cnf -new -out pixel.internal.csr -key pixel.privatekey.pem```

To check the CSR created:

```openssl req -in pixel.internal.csr -noout -text```

## Generate your certificate signed by you

To generate your certificate for my.domain.com execute

```openssl x509 -req -in pixel.internal.csr -out pixel.internal.crt -CAkey pixel.pem -CA pixel.pem -days 365 -CAcreateserial -CAserial pixel.internal.serial -extensions v3_req -extfile pixel.internal.cnf```

To check your new certificate :

```openssl x509 -in pixel.internal.com.crt -noout -text```

 