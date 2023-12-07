#!/bin/bash

# Define a variable to store the container path
WORKING_PATH="/home/hero/dapp"
CONTAINER_PATH="/var/www/dapp"
CONTAINER_NAME="sw-pm2dapp"

# goto folder
cd -P "$WORKING_PATH"

# git pull from latest repo
output=$(git pull)

if [[ ! $output == *"Already up to date."* ]]; then
    # copy directory to docker container path
    docker cp . "$CONTAINER_NAME":"$CONTAINER_PATH"

    # docker execute npm run build 和 pm2 start pm2.json
    docker exec -it "$CONTAINER_NAME" npm install
    docker exec -it "$CONTAINER_NAME" npm run build
    docker exec -it "$CONTAINER_NAME" pm2 restart pm2.json
fi