#Set base image to Ubuntu
FROM debian:jessie

MAINTAINER Eric Andre <ericandre615@gmail.com>

# replace shell with bash so we can use source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# create source dir
RUN mkdir -p /var/www/ericandreinfo

ENV APP_DIR /var/www/ericandreinfo
ENV PORT 80
ENV NPM_VERSION 3.10.9
ENV NODE_VERSION 6.9.1

# Define working directory
WORKDIR ${APP_DIR}

ADD . /var/www/ericandreinfo

# Install stuffs
RUN apt-get update
RUN apt-get install -y -q --no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    curl \
    g++ \
    gcc \
    git \
    make \
    nginx \
    sudo \
    wget \
#    node \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get -y autoclean

RUN curl -SL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

RUN npm install n -g
RUN sudo n $NODE_VERSION

ADD package.json ./

RUN npm install yarn -g
RUN npm install pm2 -g

RUN yarn install

ADD . ${APP_DIR}

# build project for production
RUN yarn prod

#COPY docker-entrypoint.sh /
#ENTRYPOINT ["/docker-entrypoint.sh"]

# Expose Port
EXPOSE 80

# Run App
CMD ["pm2", "start", "processes.json", "--no-daemon"]
