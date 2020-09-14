name := "sample-extension-scala"

scalaVersion := "2.13.3"

val AkkaVersion = "2.5.31"

val AkkaHttpVersion = "10.2.0"

libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-stream" % AkkaVersion,
  "com.lightbend.akka" %% "akka-stream-alpakka-slick" % "2.0.1",
  "com.typesafe.akka" %% "akka-http" % AkkaHttpVersion,
  "com.typesafe.akka" %% "akka-http-spray-json" % AkkaHttpVersion,
  "com.h2database" % "h2" % "1.4.200"
)

enablePlugins(JavaAppPackaging)

dockerBaseImage := "openjdk:11.0-jre-slim"

dockerExposedPorts := Seq(8080)