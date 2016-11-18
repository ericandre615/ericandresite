#!/usr/bin/env bash

cd ../

docker run \
        -d \
        --name "web" \
        -p 8080:80 \
        -v $(pwd)/public:/var/www/public \
        -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf \
        --link nodejs:nodejs \
        nginx;
