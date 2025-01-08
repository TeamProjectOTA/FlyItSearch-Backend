# Stage 1: Build the application
FROM node:20-alpine AS builder

# Install only necessary build tools
RUN apk add --no-cache g++ make python3

# Set the working directory
WORKDIR /app

# Copy only package files to install dependencies
COPY package*.json ./

# Install only production dependencies initially
RUN npm ci --only=production

# Install devDependencies temporarily for the build
RUN npm install

# Copy the entire application source code
COPY . .

# Build the application
RUN npm run build


# Stage 2: Production environment
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production --no-audit --no-fund

# Remove unnecessary files to reduce image size
RUN rm -rf /tmp/* /var/cache/apk/*

# Expose the application port
EXPOSE 8080

# Start the application
CMD [ "npm", "run", "start:prod" ]
