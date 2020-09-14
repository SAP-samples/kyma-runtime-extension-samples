package kyma.samples.scala.model

import java.time.LocalDateTime

case class CreateOrder(id: String, description: String)

case class Order(id: String, description: String, created: LocalDateTime)

object Model {
  def to(createOrder: CreateOrder): Order = Order(createOrder.id, createOrder.description, LocalDateTime.now())
}
