FROM node:16-alpine3.15 as base
WORKDIR '/app/client'
COPY package*.json ./
RUN npm ci --force
COPY src/ ./src
COPY public ./public
RUN npm run build

# Copy static build files to nginx image to serve up
FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=base app/client/build/ /usr/share/nginx/html