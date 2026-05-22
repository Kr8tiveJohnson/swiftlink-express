FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN mkdir -p /data

ENV DATA_DIR=/data
EXPOSE 5000

CMD ["npm", "start"]
