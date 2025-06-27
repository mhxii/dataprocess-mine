error id: file:///C:/CodeMine/dataprocess%20mine/backend/build.sbt:
file:///C:/CodeMine/dataprocess%20mine/backend/build.sbt
empty definition using pc, found symbol in pc: 
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 359
uri: file:///C:/CodeMine/dataprocess%20mine/backend/build.sbt
text:
```scala
name := """dataprocess"""
organization := "sn.esp.val"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)
fork in run := true
scalaVersion := "2.13.16"

libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.1" % Test

// Adds additional packages into T@@wirl
//TwirlKeys.templateImports += "sn.esp.val.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "sn.esp.val.binders._"

```


#### Short summary: 

empty definition using pc, found symbol in pc: 