#!/bin/bash

imageName=gfi-web-bo-img
containerName=gfi-web-bo-container

echo Delete old image...
sudo docker image rm -f $imageName

sudo docker build -t $imageName -f /home/oth_proj/gfi_web_bo/Dockerfile_sandbox_bo  /home/oth_proj/gfi_web_bo/

echo Delete old container...
sudo docker rm -f $containerName

echo Run new container...
sudo docker run -d  --restart unless-stopped -p 4011:8002 --name $containerName $imageName

echo wait for 10 second
#sleep 10

echo Docker process 
sudo docker ps
