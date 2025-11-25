# Frontend Dockerfile (runs CRA dev server by default)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --silent

COPY . .

ENV CHOKIDAR_USEPOLLING=true
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
