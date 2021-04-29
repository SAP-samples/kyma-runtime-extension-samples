from concurrent import futures
import time
import math
import logging

import grpc

import os
import random
import string

import orders_pb2
import orders_pb2_grpc
import datetime

_SIGNATURE_HEADER_KEY = 'x-signature'


class AuthGateway(grpc.AuthMetadataPlugin):

    def __call__(self, context, callback):
        """Implements authentication by passing metadata to a callback.

        Implementations of this method must not block.

        Args:
          context: An AuthMetadataContext providing information on the RPC that
            the plugin is being called to authenticate.
          callback: An AuthMetadataPluginCallback to be invoked either
            synchronously or asynchronously.
        """
        # Example AuthMetadataContext object:
        # AuthMetadataContext(
        #     service_url=u'https://localhost:50051/helloworld.Greeter',
        #     method_name=u'SayHello')
        signature = context.method_name[::-1]
        callback(((os.environ.get("_GRPC_TOKEN_"), signature),), None)


def id_generator(size=3, chars=string.ascii_uppercase):
    return ''.join(random.choice(chars) for _ in range(size))


def get_orders(stub):
    order = orders_pb2.OrderRequest()
    orders = stub.GetOrders(order)
    for order in orders:
        print("Ordered %s of: %s at: %s for %s" %
              (order.amount, order.symbol, order.date, order.cost))


def generate_order(stub):
    i = 1
    while i < 6:
        record_order(stub, id_generator(), random.randrange(1000))
        i += 1


def record_order(stub, symbol, amount):
    order = orders_pb2.OrderRequest()
    order.symbol = symbol
    order.amount = amount
    orderResult = stub.RecordOrder(order)
    print("Ordered %s of: %s at: %s for %s" %
          (orderResult.amount, orderResult.symbol, orderResult.date, orderResult.cost))


def run():
    with open("kyma.pem", "rb") as fp:
        channel_credential = grpc.ssl_channel_credentials(fp.read())

    call_credentials = grpc.metadata_call_credentials(AuthGateway(),
                                                      name='auth gateway')
    composite_credentials = grpc.composite_channel_credentials(
        channel_credential,
        call_credentials,
    )

    if os.environ.get("_DEV_") == "true":
        print("-------------- insecure_channel --------------")
        channel = grpc.insecure_channel('127.0.0.1:50051')
    else:
        print("-------------- secure_channel --------------")
        channel = grpc.secure_channel(
            'grpcorderserver.a0e7f99.kyma.shoot.live.k8s-hana.ondemand.com:443', composite_credentials)

    stub = orders_pb2_grpc.OrderStub(channel)
    print("-------------- RecordOrder--------------")
    generate_order(stub)
    print("-------------- GetOrders --------------")
    get_orders(stub)
    channel.close()


if __name__ == '__main__':
    logging.basicConfig()
    run()
