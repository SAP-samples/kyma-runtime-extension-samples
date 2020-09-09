package kyma.gitops

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import akka.util.ByteString

import scala.concurrent.ExecutionContextExecutor

object WebServer {
  def main(args: Array[String]): Unit = {
    implicit val system: ActorSystem = ActorSystem("sample-extension-scala")
    implicit val materializer: ActorMaterializer = ActorMaterializer()
    implicit val executionContext: ExecutionContextExecutor = system.dispatcher

    val route = path("") {
      complete(HttpEntity(contentType = ContentTypes.`application/json`,
        data = ByteString(
          """
            |{"response" : "Kyma GitOps with Flux and scala app"}
            |""".stripMargin)))
    }

    Http().bindAndHandle(route, "0.0.0.0", 8080)
    println("Server online at http://:8080/")
  }
}
