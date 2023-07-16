#!/bin/bash
kill -9 $(lsof -i:3000 -t) 2> /dev/null

postgres_container_name="postgres_dev_5534"
if ( nc -zv localhost 5432 2>&1 >/dev/null ); then
    if [ ! "$(docker ps -q -f name=$postgres_container_name)" ]; then
        if [ "$(docker ps -aq -f status=exited -f name=$postgres_container_name)" ]; then
            # cleanup
            docker rm $postgres_container_name
        fi
    fi
    # run your container
    docker run --name $postgres_container_name \
    -e POSTGRES_USER='postgres' \
    -e POSTGRES_PASSWORD='123' \
    -e PGDATA='/data/postgres' \
    -v postgres:/data/postgres \
    -p 5534:5432 \
    -d postgres:15.1
fi

yarn start:debug