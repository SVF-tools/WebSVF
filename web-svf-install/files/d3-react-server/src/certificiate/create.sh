openssl genrsa 1024 > ./private.pem
openssl req -new -key ./private.pem -out ./csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey ./private.pem -out ./file.crt