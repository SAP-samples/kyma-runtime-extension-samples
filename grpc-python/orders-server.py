from concurrent import futures
import time
import math
import logging

import grpc

import os
import random

import orders_pb2
import orders_pb2_grpc
from datetime import datetime


class SignatureValidationInterceptor(grpc.ServerInterceptor):

    def __init__(self):

        def abort(ignored_request, context):
            context.abort(grpc.StatusCode.UNAUTHENTICATED, 'Invalid Token')

        self._abortion = grpc.unary_unary_rpc_method_handler(abort)

    def intercept_service(self, continuation, handler_call_details):
        if os.environ.get("_DEV_") is not None and os.environ.get("_DEV_") == "true":
            return continuation(handler_call_details)
        else:
            method_name = handler_call_details.method.split('/')[-1]
            expected_metadata = (os.environ.get(
                "_GRPC_TOKEN_"), method_name[::-1])
            if expected_metadata in handler_call_details.invocation_metadata:
                return continuation(handler_call_details)
            else:
                return self._abortion


class OrderServicer(orders_pb2_grpc.OrderServicer):
    """Provides methods that implement functionality of order server."""

    global orderlist
    orderlist = []

    def RecordOrders(self, request_iterator, context):

        start_time = time.time()
        count = 0

        for ord in request_iterator:
            order = orders_pb2.OrderReply()
            now = datetime.now()
            count += 1
            order.symbol = ord.symbol
            order.amount = ord.amount
            order.date = now.strftime("%m/%d/%Y, %H:%M:%S")
            order.cost = random.uniform(1, 100)
            orderlist.append(order)

        elapsed_time = time.time() - start_time
        return orders_pb2.OrderSummary(
            created=count, elapsed_time=elapsed_time
        )

    def GetOrders(self, request, context):
        print("---GetOrders---")
        OrderReply = orders_pb2.OrderReply()
        for order in orderlist:
            OrderReply.symbol = order.symbol
            OrderReply.amount = order.amount
            OrderReply.date = order.date
            OrderReply.cost = order.cost
            print("Ordered %s of: %s at: %s for %s" %
                  (OrderReply.amount, OrderReply.symbol, OrderReply.date, OrderReply.cost))
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
