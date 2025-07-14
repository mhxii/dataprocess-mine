##########################
# Étape 1 : Build Backend Play (Scala)
##########################
FROM hseeberger/scala-sbt:11.0.17_1.8.2_2.13.10 as backend-build

WORKDIR /app

# Copier le backend
COPY backend /app/backend
WORKDIR /app/backend

# Compile le backend
RUN sbt dist

##########################
# Étape 2 : Build Frontend React
##########################
FROM node:18-alpine as frontend-build

WORKDIR /app

# Copier le frontend
COPY frontend /app/frontend
WORKDIR /app/frontend

# Installer dépendances et builder
RUN npm install && npm run build

##########################
# Étape 3 : Image finale de production
##########################
FROM eclipse-temurin:11-jre

WORKDIR /app

# Dézipper le backend Play dist
COPY --from=backend-build /app/backend/target/universal/*.zip /app/
RUN apt-get update && apt-get install -y unzip && \
    unzip *.zip && \
    mv backend-* backend && \
    rm *.zip

# Copier le build React vers le dossier public du backend
COPY --from=frontend-build /app/frontend/build /app/backend/public

# Exposer le port utilisé par Play
EXPOSE 9000

# Lancer le backend Play
CMD ["/app/backend/bin/backend", "-Dplay.http.secret.key=changeme"]
