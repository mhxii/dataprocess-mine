FROM node:18

WORKDIR /app

COPY . .

RUN npm install && npm run build

# Utilise nginx pour servir les fichiers
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
