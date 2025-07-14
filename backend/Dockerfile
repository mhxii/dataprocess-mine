FROM hseeberger/scala-sbt:11.0.19_1.9.7_2.13.13

WORKDIR /app

COPY . .

RUN sbt clean compile stage

EXPOSE 9000

CMD ["target/universal/stage/bin/backend", "-Dplay.http.secret.key=changeme", "-Dplay.http.port=9000"]
