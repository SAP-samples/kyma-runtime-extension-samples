from concurrent import futures
import time
import math
import logging

import grpc

import os

import orders_pb2
import orders_pb2_grpc
from datetime import datetime


class SignatureValidationInterceptor(grpc.ServerInterceptor):

    def __init__(self):

        def abort(ignored_request, context):
            context.abort(grpc.StatusCode.UNAUTHENTICATED, 'Invalid Token')

        self._abortion = grpc.unary_unary_rpc_method_handler(abort)

    def intercept_service(self, continuation, handler_call_details):
        method_name = handler_call_details.method.split('/')[-1]
        expected_metadata = (os.environ.get("_GRPC_TOKEN_"), method_name[::-1])
        if expected_metadata in handler_call_details.invocation_metadata:
            return continuation(handler_call_details)
        else:
            return self._abortion


class OrderServicer(orders_pb2_grpc.OrderServicer):
    """Provides methods that implement functionality of order server."""

    global orderlist
    orderlist = []

    def RecordOrder(self, request, context):

        now = datetime.now()
        order = orders_pb2.OrderReply()
        order.name = request.name
        order.id = request.id
        order.date = now.strftime("%m/%d/%Y, %H:%M:%S")

        orderlist.append(order)

        return order

    def GetOrders(self, request, context):
        print("---GetOrders---")
        OrderReply = orders_pb2.OrderReply()
        for order in orderlist:
            OrderReply.name = order.name
            OrderReply.id = order.id
            OrderReply.date = order.date
            print("Recorded Order name: %s Order Id: %s at: %s" %
                  (OrderReply.name, OrderReply.id, OrderReply.date))
            yield OrderReply


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(
        max_workers=10), interceptors=(SignatureValidationInterceptor(),))
    orders_pb2_grpc.add_OrderServicer_to_server(
        OrderServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
