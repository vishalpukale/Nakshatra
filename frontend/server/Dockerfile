FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 6029
CMD [ "node", "index.js" ]