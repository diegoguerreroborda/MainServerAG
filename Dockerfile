FROM node
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN apt update
RUN apt install iputils-ping
CMD node indexMS.js