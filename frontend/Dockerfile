FROM node:18-alpine
WORKDIR /app
COPY frontend ./
RUN npm install && npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
