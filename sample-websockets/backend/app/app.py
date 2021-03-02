import json
from typing import Optional, Awaitable

import tornado.web
import tornado.websocket
import tornado.ioloop
from tornado import web

wscs = []


class IndexHandler(web.RequestHandler):
    def data_received(self, chunk: bytes) -> Optional[Awaitable[None]]:
        pass

    def get(self):
        self.render("index.html")


class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def data_received(self, chunk: bytes) -> Optional[Awaitable[None]]:
        pass

    def check_origin(self, origin: str) -> bool:
        return True

    def open(self):
        print("New client connected")
        if self not in wscs:
            wscs.append(self)
        self.write_message("You are connected")

    def on_message(self, message):
        print("message received")
        self.write_message("from server--" + message)

    def on_close(self) -> None:
        if self in wscs:
            wscs.remove(self)
        print("client connection closed")


class ApiHandler(web.RequestHandler):

    def post(self):
        if self.request.headers.get("Content-Type", "").startswith("application/json"):
            jsonBody = json.loads(self.request.body)
            orderCode = jsonBody["orderCode"]
            print(orderCode)
            for wsc in wscs:
                wsc.write_message(jsonBody)


application = tornado.web.Application([
    (r"/", IndexHandler),
    (r"/ws", WebSocketHandler),
    (r"/events", ApiHandler)
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
