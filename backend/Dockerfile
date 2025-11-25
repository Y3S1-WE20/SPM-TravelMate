# Backend Dockerfile (development-friendly)
FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production --silent

# Copy source
COPY . .

ENV PORT=5001
EXPOSE 5001

# Default command (can be overridden by docker-compose for dev)
CMD ["node", "server.js"]
