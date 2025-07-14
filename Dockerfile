# Étape 1 : builder frontend React
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


# Étape 2 : builder backend Scala
FROM hseeberger/scala-sbt:11.0.17_1.8.2_2.13.10 AS backend

WORKDIR /app

COPY backend/project ./backend/project
COPY backend/build.sbt ./backend/
COPY backend/ ./

# Copie le build React dans le dossier public de Play
COPY --from=frontend-build /app/frontend/build ./backend/public/

RUN sbt backend/compile backend/dist


# Étape 3 : conteneur final
FROM eclipse-temurin:11-jre

WORKDIR /app

# Copie le JAR / ZIP du backend compilé
COPY --from=backend-build /app/backend/target/universal/*.zip /app/

# Décompresser le ZIP Play dist
RUN apt-get update && apt-get install -y unzip && \
    unzip *.zip && \
    rm *.zip && \
    mv dataprocess-* dataprocess && \
    apt-get clean

# Heroku utilise le port d’environnement PORT
ENV PORT=9000

EXPOSE 9000

# Lancer l'app Play
CMD ["dataprocess/bin/dataprocess", "-Dplay.http.secret.key=mysecretkey", "-Dhttp.port=9000"]
