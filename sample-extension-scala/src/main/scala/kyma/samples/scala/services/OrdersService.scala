package kyma.samples.scala.services

import java.time.LocalDateTime

import akka.actor.ActorSystem
import akka.stream.alpakka.slick.scaladsl.SlickSession
import kyma.samples.scala.model.Order

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContextExecutor, Future}
import scala.language.postfixOps

class OrdersService(system: ActorSystem) {
  implicit val session: SlickSession = SlickSession.forConfig("database-in-memory")
  private implicit val ec: ExecutionContextExecutor = system.dispatcher

  system.registerOnTermination(() => session.close())

  import session.profile.api._

  class Orders(tag: Tag) extends Table[Order](_tableTag = tag, _tableName = "ORDERS") {
    def id = column[String](" ID", O.PrimaryKey)

    def description = column[String]("DESCRIPTION")

    def created = column[LocalDateTime]("CREATED")

    override def * = (id, description, created) <> (Order.tupled, Order.unapply)
  }

  val orders = TableQuery[Orders]

  initTable()

  private def initTable(): Unit = {
    val setupQueries = DBIO.seq(orders.schema.createIfNotExists)
    val setupFuture = session.db.run(setupQueries) map (_ => println("Schema created"))
    Await.result(setupFuture, 5 seconds)
  }

  private val queryById = Compiled((id: Rep[String]) => orders.filter(_.id === id))

  def insert(order: Order): Future[Int] = session.db.run(orders += order)

  def findAll: Future[Seq[Order]] = session.db.run(orders.to[Seq].result)

  def delete(id: String): Future[String] = session.db.run(queryById(id).delete) map (_.toString)

  def find(id: String): Future[Option[Order]] = session.db.run(queryById(id).result.headOption)

  def update(order: Order): Future[String] = session.db.run(queryById(order.id).update(order)) map (_.toString)
}
