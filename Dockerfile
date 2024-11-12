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
# Copy the NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output to the NGINX html directory
COPY --from=build /blog-site-ui/dist /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 80

# Start NGINX (default CMD in the nginx:alpine image will be used)







## Use an official Node.js image as a base for building the app
#FROM node:18 AS build
#
## Set the working directory
#WORKDIR /app
#
## Copy package.json and package-lock.json
#COPY package*.json ./
#
## Install dependencies
#RUN npm install
#
#
## Copy the rest of the application code
#COPY . .
#RUN npm i
#RUN npm install -g npx
## Build the React application
#RUN npm run build
## Use a lightweight NGINX image to serve the built app
#FROM nginx:alpine
#RUN npm install -g serve
## Copy the build output to the NGINX html directory
#COPY --from=build /app/dist /usr/share/nginx/html
#
## Expose port 80 to serve the app
#EXPOSE 80
#
## Start NGINX
#COPY nginx.conf /etc/nginx/nginx.conf
#CMD ["/usr/local/bin/npx", "serve", "-s", "build", "-l", "3000"]
#




# React build creation
#FROM node:latest as node
#ARG REACT_APP_BASE_URL
#ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
#WORKDIR /app
#COPY . .
#RUN npm i
#RUN npm run build
#
## NGINX configuration
#FROM nginx:alpine
#COPY --from=build /app/dist /usr/share/nginx/html
##COPY --from=build /app/dist /usr/share/nginx/html
#COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
#EXPOSE 3000
#CMD ["nginx", "-g", "daemon off;"]
