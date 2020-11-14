FROM node:14.5.0

WORKDIR .

COPY package*.json ./

RUN npm install

COPY . .

CMD npm run start