#!/bin/bash

set -euo pipefail

readonly IMAGE=ghcr.io/sriram23/sudeshi
readonly TAG=v1
readonly NAME=sudeshi
readonly PORT=3000

stopContainer() {
	echo "Stopping existing docker container..."
	docker stop "$NAME"
	echo "Docker container stopped."
}

removeContainer() {
	echo "Removing the stopped container..."
	docker rm "$NAME"
	echo "Docker container removed."
}


startContainer() {
	echo "Starting the new container..."
	if docker run -d --name "$NAME" --restart unless-stopped -p "$PORT:$PORT" "$IMAGE:$TAG"; then
		echo "Deployment Successful!"
	else
		echo "Deployment failed..."
		exit 1
	fi
}

echo "Pulling latest image..."
if docker pull "$IMAGE:$TAG"; then
	echo "Latest image pulled successfully"
	if docker ps -a --format '{{.Names}}' | grep -wq "$NAME"; then
		echo "Redeploying..."
		stopContainer
		removeContainer
		startContainer
		echo "Current running containers: "
		docker ps
		echo "Deployment completed successfully!"
	else
		echo "No existing container found. Performing fresh deployment..."
		echo "Deploying..."
		startContainer
		echo "Current running containers: "
		docker ps
		echo "Deployment completed successfully!"
	fi
fi
