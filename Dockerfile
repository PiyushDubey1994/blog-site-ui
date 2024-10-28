# Use an official Node.js image as a base for building the app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Use a lightweight NGINX image to serve the built app
FROM nginx:alpine

# Copy the build output to the NGINX html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
