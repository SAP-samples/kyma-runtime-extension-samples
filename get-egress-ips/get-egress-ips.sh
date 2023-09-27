#!/bin/bash

ZONES=$(kubectl get nodes -o jsonpath='{.items[*].metadata.labels.topology\.kubernetes\.io/zone}')

ZONES=$(for i in ${ZONES[@]}; do echo $i; done | sort -u)

for zone in $ZONES; do overrides="{ \"apiVersion\": \"v1\", \"metadata\" : { \"labels\": { \"sidecar.istio.io/inject\" : \"false\" } }, \"spec\": { \"nodeSelector\": { \"topology.kubernetes.io/zone\": \"$zone\" } } }"
kubectl run -i --tty busybox --image=curlimages/curl --restart=Never --overrides="$overrides" --rm --command -- curl http://ifconfig.me/ip >>/tmp/cluster_ips 2>/dev/null
done

awk '{gsub("pod \"busybox\" deleted", "", $0); print}' /tmp/cluster_ips 
rm /tmp/cluster_ips

