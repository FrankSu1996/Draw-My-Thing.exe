# Specify a base image
FROM node:16-alpine3.15

# Install dependencies
COPY ./ ./
RUN npm ci

# Default command
CMD ["npm", "start"]