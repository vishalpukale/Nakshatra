#!/bin/bash

imageName=gfi-web-img
containerName=gfi-web-container

echo Delete old image...
sudo docker image rm -f $imageName

sudo docker build -t $imageName -f /home/oth_proj/gfi_web/Dockerfile  /home/oth_proj/gfi_web/

echo Delete old container...
sudo docker rm -f $containerName

echo Run new container...
sudo docker run -d  --restart unless-stopped -p 6029:8002 --name $containerName $imageName

echo wait for 10 second
#sleep 10

echo Docker process 
sudo docker ps
