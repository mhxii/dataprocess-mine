FROM sbtscala/scala-sbt:eclipse-temurin-jammy-11.0.21_9_1.9.7_2.13.12 AS build
WORKDIR /app
COPY backend ./
RUN sbt clean dist

FROM eclipse-temurin:11-jre
WORKDIR /app
RUN apt-get update && apt-get install -y unzip && apt-get clean
COPY --from=build /app/target/universal/*.zip /app/
RUN unzip *.zip && mv dataprocess-1.0 backend && rm *.zip
CMD ["/app/backend/bin/dataprocess", "-Dplay.http.secret.key=changeme", "-Dplay.server.http.port=9000"]
