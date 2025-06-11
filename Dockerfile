# Use the official Node.js image as the base
FROM node:20.13.1 as base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY --chown=node:node package*.json ./

# Install all dependencies, including devDependencies
RUN npm ci

# Copy the entire project to the working directory
COPY --chown=node:node . .

# Build the application
RUN npm run build

# Make sure curl is installed for the healthchecks
RUN apt-get update && apt-get install -y curl

# Switch to the non-root 'node' user
USER node

# Expose the port on which your application will run (default is 3000)
ENV PORT=${PORT:-3000}
EXPOSE $PORT

# Make sure NODE_PATH points to the correct node_modules
ENV NODE_PATH=/app/node_modules

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/probe/liveness || exit 1

# Ensure the entrypoint script is executable
RUN chmod +x /app/scripts/entrypoint.sh

# Run the entrypoint script
CMD ["/bin/bash", "/app/scripts/entrypoint.sh"]