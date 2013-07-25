zenbox-backend

==============

Security setup

--------------

Generate private key and certificate in the security folder:


```bash

$ openssl genrsa -out zenbox-key.pem 1024

$ openssl req -new -key zenbox-key.pem -out certrequest.csr

Country Name (2 letter code) [AU]:FR

State or Province Name (full name) [Some-State]:Pays de la loire

Locality Name (eg, city) []:Nantes

Organization Name (eg, company) [Internet Widgits Pty Ltd]:Zen Factory

Organizational Unit Name (eg, section) []:

Common Name (e.g. server FQDN or YOUR name) []:zenbox.herokuapp.com                                                        

Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request

A challenge password []:

An optional company name []:

openssl x509 -req -in certrequest.csr -signkey zenbox-key.pem -out zenbox-cert.pem

```
