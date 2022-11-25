
FROM node:19.1.0

WORKDIR /

COPY package*.json ./

RUN npm install --production

COPY . .

ENV PORT=5050

EXPOSE 5050

CMD ["npm", "start"]%