# 1. Base image
FROM node:18-alpine  
# Use a Node.js 18 image with Alpine Linux

# 2. Working directory
WORKDIR /app 
 # Set the working directory within the container

# 3. Copy package.json and package-lock.json
COPY package*.json ./ 
 # Copy these files for dependency management

# 4. Install dependencies
RUN npm install  
# Install dependencies using npm

# 5. Copy project files
COPY . . 
COPY .env .
ENV DB_HOST=192.168.10.91
ENV DB_PORT=3306
ENV DB_NAME=flyitsearch
ENV DB_USERNAME=root
ENV DB_PASSWORD=admin
ENV DATABASE_NAME=test

 # Copy all project files to the working directory

# 6. Build the NestJS application (adjust if needed)
RUN npm run build

# 7. Expose port (adjust if needed)
EXPOSE 3000  
# Expose the port where your NestJS app listens (usually 3000)

# 8. Start command
CMD [ "node", "dist/main.js" ] 
 # Command to run the application
