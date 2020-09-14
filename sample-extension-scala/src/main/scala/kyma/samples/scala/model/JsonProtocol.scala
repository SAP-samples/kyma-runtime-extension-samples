package kyma.samples.scala.model

import java.time.format.DateTimeFormatter
import java.time.{Instant, LocalDateTime, ZoneId}

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json.{DefaultJsonProtocol, JsNumber, JsString, JsValue, RootJsonFormat}

object JsonProtocol extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val createOrderFormat: RootJsonFormat[CreateOrder] = jsonFormat2(CreateOrder)

  implicit val localDateTimeFormat: RootJsonFormat[LocalDateTime] = new RootJsonFormat[LocalDateTime] {
    private val dateTimeFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

    override def read(json: JsValue): LocalDateTime = json match {
      case JsNumber(value) =>
        val instant = Instant.ofEpochMilli(value.toLong)
        instant.atZone(ZoneId.systemDefault()).toLocalDateTime
      case JsString(value) =>
        val formatter = dateTimeFormatter
        LocalDateTime.parse(value, formatter)
      case _ => throw new RuntimeException("Invalid format dat")
    }

    override def write(obj: LocalDateTime): JsValue = JsString(obj.format(dateTimeFormatter))
  }
  implicit val orderFormat: RootJsonFormat[Order] = jsonFormat3(Order)
}
