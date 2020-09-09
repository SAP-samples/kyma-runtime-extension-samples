name := "sample-extension-scala"

scalaVersion := "2.13.3"

libraryDependencies += "com.typesafe.akka" %% "akka-http" % "10.1.11"

libraryDependencies += "com.typesafe.akka" %% "akka-stream" % "2.5.26"

enablePlugins(JavaAppPackaging)

dockerBaseImage := "openjdk:11.0-jre-slim"

dockerExposedPorts := Seq(8080)