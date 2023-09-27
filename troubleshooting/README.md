# Troubleshooting

The file contains the troubleshooting guide when working with various scenarios and aspects of SAP BTP, Kyma runtime.

## On-premise connectivity

- Ensure only one service instance of `connectivity` with plan `connectivity_proxy` has been created
- To make calls to the on-premise system via the connectivity proxy, the communication takes place via Istio Service Mesh. Ensure any workloads (Pods) which are calling the on-premise system via the connectivity proxy has Istio proxy sidecar enabled.