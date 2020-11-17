FROM node:14.5.0

WORKDIR .

COPY package*.json ./dist

RUN npm install

COPY . .

CMD npm run build && npm run start