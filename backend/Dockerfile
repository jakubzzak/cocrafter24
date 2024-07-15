# Add the necessary commands to create a Docker image for the backend service
FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

COPY ./ ./

RUN npm ci
RUN npm run compile

CMD ["sh", "-c", "npm run knex:migrate:latest ; npm run knex:seed ; node ./.build/src/app.js"]