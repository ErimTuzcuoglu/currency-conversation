#Creates a layer from node:alpine image.
FROM node:alpine

#Sets the working directory for any RUN, CMD, ENTRYPOINT, COPY, and ADD commands
WORKDIR /usr/src/app

#Copy new files or directories into the filesystem of the container
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

#Execute commands in a new layer on top of the current image and commit the results
RUN yarn

##Copy new files or directories into the filesystem of the container
COPY . /usr/src/app

#Execute commands in a new layer on top of the current image and commit the results
RUN yarn run build

#Informs container runtime that the container listens on the specified network ports at runtime
EXPOSE 3000

#Allows you to configure a container that will run as an executable
ENTRYPOINT ["yarn", "run"]