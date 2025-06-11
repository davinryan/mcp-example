#!/bin/bash
set -e

handle_sigint() {
  echo "Received SIGINT signal. Forwarding to the Node.js process..."
  kill -SIGINT "$child_pid"
  wait "$child_pid"
}

trap handle_sigint SIGINT

# Unbuffer stdout and stderr
stdbuf -o0 -e0 echo "=====The Database URL is: ${DATABASE_URL}"

exec npm run start -- --port "$PORT" &

child_pid=$!

wait "$child_pid"