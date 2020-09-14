package kyma.samples.scala

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import akka.util.ByteString
import kyma.samples.scala.routes.OrdersRoutes
import kyma.samples.scala.services.OrdersService

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

    Http().newServerAt("0.0.0.0", 8080).bindFlow(new OrdersRoutes(new OrdersService(system)).route)
    println("Server online at http://:8080/")
  }
}
