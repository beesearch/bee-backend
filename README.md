# bee-backend

==============

Security setup

--------------

Go in the in the keys folder and generate the sign key :

```bash

$ cd keys

$ openssl genrsa -out bee-key.pem 1024

```

Then generate the certificate request :

```bash

$ openssl req -new -key bee-key.pem -out certrequest.csr

Country Name (2 letter code) [AU]:FR
State or Province Name (full name) [Some-State]:Pays de la loire
Locality Name (eg, city) []:Nantes
Organization Name (eg, company) [Internet Widgits Pty Ltd]:BeeSearch
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:beesearch.fr
Email Address []:your.address@beesearch.fr

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:

```

Finally generate the certificate

```bash

$ openssl x509 -req -in certrequest.csr -signkey bee-key.pem -out bee-cert.pem

```
