# Use Node 20 Alpine image
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache g++ make python3

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies (ignoring dev dependencies)
RUN npm install --omit=dev

# Copy the rest of the app code
COPY . .

# Build the app using NestJS CLI
RUN npm run build

# Expose the app on port 3000
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
