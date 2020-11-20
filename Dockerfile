FROM node:14.15.1

COPY . .

RUN npm install && npm run build

CMD npm run start