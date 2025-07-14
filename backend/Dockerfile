# Étape 1 : build Play (Scala)
FROM sbtscala/scala-sbt:eclipse-temurin-jammy-11.0.21_9_1.9.7_2.13.12 AS backend-build

WORKDIR /app
COPY . .

RUN sbt clean dist

# Étape 2 : runtime
FROM eclipse-temurin:11-jre

RUN groupadd -r playuser && useradd -r -g playuser playuser
WORKDIR /app

RUN apt-get update && apt-get install -y unzip && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=backend-build /app/target/universal/*.zip /app/
RUN unzip *.zip && \
    mv dataprocess-1.0 backend && \
    rm *.zip && \
    chmod +x /app/backend/bin/dataprocess

COPY --from=backend-build /app/public /app/backend/public

RUN chown -R playuser:playuser /app
USER playuser

EXPOSE 9000
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC -Dpidfile.path=/dev/null"

CMD ["/app/backend/bin/dataprocess", "-Dplay.http.secret.key=a-very-long-random-secret-key-that-should-be-at-least-32-characters-long-for-security", "-Dplay.server.http.port=9000"]
