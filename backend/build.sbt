scalaVersion := "2.13.16"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

Compile / run / fork := true
Compile / run / javaOptions += "-Xmx4G"

name := "dataprocess"

version := "1.0"

libraryDependencies ++= Seq(
guice,
ws,
"org.apache.pekko" %% "pekko-actor-typed" % "1.0.2"
)