##########################
# Étape 1 : Build Backend Play (Scala)
##########################
FROM eclipse-temurin:11-jdk AS backend-build

# Installer SBT
RUN apt-get update && \
    apt-get install -y curl && \
    curl -L -o sbt.deb https://repo.scala-sbt.org/scalasbt/debian/sbt-1.8.2.deb && \
    dpkg -i sbt.deb && \
    rm sbt.deb && \
    apt-get clean

WORKDIR /app

# Copier le backend
COPY backend /app/backend
WORKDIR /app/backend

# Pré-télécharger les dépendances pour optimiser le cache Docker
COPY backend/project/build.properties backend/project/plugins.sbt backend/build.sbt ./
RUN sbt update

# Copier le reste du code et compiler
COPY backend .
RUN sbt dist

##########################
# Étape 2 : Build Frontend React
##########################
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copier le frontend
COPY frontend/package*.json /app/frontend/
WORKDIR /app/frontend

# Installer les dépendances (optimisation cache)
RUN npm ci --only=production

# Copier le reste du code frontend
COPY frontend .

# Builder le frontend
RUN npm run build

##########################
# Étape 3 : Image finale de production
##########################
FROM eclipse-temurin:11-jre

# Créer un utilisateur non-root pour la sécurité
RUN groupadd -r playuser && useradd -r -g playuser playuser

WORKDIR /app

# Installer unzip
RUN apt-get update && \
    apt-get install -y unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copier et dézipper le backend Play dist
COPY --from=backend-build /app/backend/target/universal/*.zip /app/
RUN unzip *.zip && \
    mv backend-* backend && \
    rm *.zip && \
    chmod +x /app/backend/bin/backend

# Copier le build React vers le dossier public du backend
COPY --from=frontend-build /app/frontend/build /app/backend/public

# Changer la propriété des fichiers
RUN chown -R playuser:playuser /app

# Basculer vers l'utilisateur non-root
USER playuser

# Exposer le port utilisé par Play
EXPOSE 9000

# Variables d'environnement pour optimiser la JVM
ENV JAVA_OPTS="-Xmx2g -Xms1g -XX:+UseG1GC -XX:+PrintGC -Dpidfile.path=/dev/null"

# Lancer le backend Play avec les optimisations JVM
CMD ["/app/backend/bin/backend", "-Dplay.http.secret.key=changeme", "-Dplay.server.http.port=9000"]
