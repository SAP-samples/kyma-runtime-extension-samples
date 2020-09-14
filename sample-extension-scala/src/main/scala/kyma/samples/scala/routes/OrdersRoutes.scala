package kyma.samples.scala.routes

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import kyma.samples.scala.model.{CreateOrder, JsonProtocol, Model, Order}
import kyma.samples.scala.services.OrdersService
import JsonProtocol._

class OrdersRoutes(svc: OrdersService) {

  val route: Route = pathPrefix("orders") {
    pathEndOrSingleSlash {
      get {
        complete(svc.findAll)
      } ~ post {
        entity(as[CreateOrder]) { createOrder =>
          val order = Model.to(createOrder)
          svc.insert(order)
          complete(order)
        }
      }
    } ~ pathPrefix(Segment) { orderId =>
      get {
        rejectEmptyResponse(complete(svc.find(orderId)))
      } ~ put {
        entity(as[Order]) { toUpdate =>
          complete(svc.update(toUpdate))
        }
      } ~ delete {
        complete(svc.delete(orderId))
      }
    }
  }
}
