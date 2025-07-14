FROM node:18-alpine AS frontend

WORKDIR /app
COPY . .

RUN npm install && npm run build

# Optionnel : servir localement en dev
CMD ["npx", "serve", "build"]
