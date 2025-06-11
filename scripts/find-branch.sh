#!/bin/bash

# Ensure the script exits if any command fails
set -e

# Check if the Docker image tag is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <docker-image-tag>"
  exit 1
fi

DOCKER_IMAGE_TAG=$1

# Extract the commit hash from the Docker image tag
COMMIT_HASH=$(echo $DOCKER_IMAGE_TAG | grep -oE '[a-f0-9]{40}')

if [ -z "$COMMIT_HASH" ]; then
  echo "Error: No valid commit hash found in the Docker image tag."
  exit 1
fi

# Find the branch that contains the commit hash
BRANCH=$(git branch --contains $COMMIT_HASH 2>/dev/null | grep -v "detached" | sed 's/^[ *]*//')

if [ -z "$BRANCH" ]; then
  echo "Error: No branch found containing commit hash $COMMIT_HASH"
  exit 1
fi

# Output the command to check out the branch
echo "To check out the branch, run the following command:"
echo "git checkout $BRANCH"