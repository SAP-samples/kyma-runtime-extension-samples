import json
from typing import Optional, Awaitable

import tornado.web
import tornado.websocket
import tornado.ioloop
from tornado import web

open_websockets = []


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
        if self not in open_websockets:
            open_websockets.append(self)
        # self.write_message("You are connected")

    def on_message(self, message):
        print("message received: " + message)
        # self.write_message("from server--" + message)

    def on_close(self) -> None:
        if self in open_websockets:
            open_websockets.remove(self)
        print("client connection closed")


class ApiHandler(web.RequestHandler):

    def data_received(self, chunk: bytes) -> Optional[Awaitable[None]]:
        pass

    def post(self):
        if self.request.headers.get("Content-Type", "").startswith("application/json"):
            json_body = json.loads(self.request.body)
            order_code = json_body["orderCode"]
            print(order_code)
            for wsc in open_websockets:
                wsc.write_message(json_body)


application = tornado.web.Application([
    (r"/", IndexHandler),
    (r"/ws", WebSocketHandler),
    (r"/events", ApiHandler),
    (r"/favicon.ico", tornado.web.StaticFileHandler, {'path', '/favicon.ico'})
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
