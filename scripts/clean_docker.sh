#!/bin/bash

echo "Stopping and removing all containers..."
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

echo "Removing all Docker images..."
docker rmi $(docker images -q)

echo "Removing all volumes..."
docker volume rm $(docker volume ls -q)

echo "Removing unused networks..."
docker network prune -f

echo "Cleaning up unused resources..."
docker system prune -a -f --volumes

echo "Checking Docker disk usage..."
docker system df
