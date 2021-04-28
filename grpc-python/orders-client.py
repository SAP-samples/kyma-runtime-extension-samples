from concurrent import futures
import time
import math
import logging

import grpc

import os

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


def get_orders(stub):
    order = orders_pb2.OrderRequest()
    orders = stub.GetOrders(order)
    for order in orders:
        print("Order name: %s Order Id: %s" % (order.name, order.id))


def generate_order(stub):
    record_order(stub, 1, "order1")
    record_order(stub, 2, "order2")
    record_order(stub, 3, "order3")
    record_order(stub, 4, "order4")


def record_order(stub, id, name):
    order = orders_pb2.OrderRequest()
    order.id = id
    order.name = name
    orderResult = stub.RecordOrder(order)
    print("Recorded Order name: %s Order Id: %s at: %s" %
          (orderResult.name, orderResult.id, orderResult.date))


def run():
    # NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
    with open("kyma.pem", "rb") as fp:
        channel_credential = grpc.ssl_channel_credentials(fp.read())

    call_credentials = grpc.metadata_call_credentials(AuthGateway(),
                                                      name='auth gateway')
    composite_credentials = grpc.composite_channel_credentials(
        channel_credential,
        call_credentials,
    )

    # with grpc.secure_channel('127.0.0.1:50051', composite_credentials) as channel:

    with grpc.secure_channel('grpcorderserver.a0e7f99.kyma.shoot.live.k8s-hana.ondemand.com:443', composite_credentials) as channel:

        stub = orders_pb2_grpc.OrderStub(channel)
        print("-------------- RecordOrder--------------")
        generate_order(stub)
        print("-------------- GetOrders --------------")
        get_orders(stub)


if __name__ == '__main__':
    logging.basicConfig()
    run()
