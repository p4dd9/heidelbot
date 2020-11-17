FROM node:14.5.0

COPY . .

RUN npm install && npm run build

CMD npm run start