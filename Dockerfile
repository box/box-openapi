# Using the latest Node 14
# FROM ubuntu:20.04
FROM node:14

# Set a working directory to use
WORKDIR /code

# Copy package management files to 
# the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN apt-get update -y
RUN apt-get install python3-pkg-resources yamllint -y

# Set the right file encoding
ENV LANG=C.UTF-8

# Port for Swagger UI
EXPOSE 8080

# Start the dev server
CMD yarn start