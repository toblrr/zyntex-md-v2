# Use an official Node.js image as a parent image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies defined in package.json
RUN npm install && npm audit fix --omit=dev

# Copy the rest of your application code
COPY . .

# Expose port 3000 (or your application's port)
EXPOSE 3000

RUN ls -l /app

# Define the command to run the application
CMD ["node", "index.js"]
