FROM node:latest

ADD . /opt/HiddenEngine
WORKDIR /opt/HiddenEngine

RUN set -xe ;\
    apt-get update ; \
    apt-get install -y openssl nodejs-legacy ; \
    apt-get clean && rm -rf /var/lib/apt/lists/* ; \
    npm install pm2 -g ; \
    mkdir ssl ; \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./ssl/ssl.key -out ./ssl/ssl.crt -subj "/C=HE/ST=HE/L=HE/O=HE" ;\
    npm install

EXPOSE 80 443

CMD npm start
