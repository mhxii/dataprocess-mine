##########################
# Étape 1 : Build Backend Play (Scala)
##########################
FROM sbtscala/scala-sbt:eclipse-temurin-jammy-11.0.21_9_1.9.7_2.13.12 AS backend-build
WORKDIR /app
# Copier tout le backend et compiler
COPY backend .
RUN sbt clean dist

##########################
# Étape 2 : Build Frontend React
##########################
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY frontend .
RUN npm install && npm run build

##########################
# Étape 3 : Image finale de production
##########################
FROM eclipse-temurin:11-jre
RUN groupadd -r playuser && useradd -r -g playuser playuser
WORKDIR /app

RUN apt-get update && \
    apt-get install -y unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copier et dézipper le backend
COPY --from=backend-build /app/target/universal/*.zip /app/
RUN unzip *.zip && \
    mv dataprocess-1.0 backend && \
    rm *.zip && \
    chmod +x /app/backend/bin/dataprocess

# Copier le frontend
COPY --from=frontend-build /app/build /app/backend/public

RUN chown -R playuser:playuser /app
USER playuser

EXPOSE 9000
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC -Dpidfile.path=/dev/null"

CMD ["/app/backend/bin/dataprocess", "-Dplay.http.secret.key=changeme", "-Dplay.server.http.port=9000"]
