#!/bin/bash
overrides="{ \"apiVersion\": \"v1\", \"spec\": { \"nodeSelector\": { \"topology.kubernetes.io/zone\": \"$zone\" } } }"

for zone in $(kubectl get nodes -o 'custom- columns=NAME:.metadata.name,REGION:.metadata.labels.topology\.kubernetes\.io/region,ZONE:.metadata.labels.topology\.kubernetes\.io/zone' -o json | jq -r '.items[].metadata.labels["topology.kubernetes.io/zone"]' | sort | uniq);
do
    kubectl run -i --tty busybox --image=yauritux/busybox-curl --restart=Never --overrides="$overrides" --rm --command -- curl http://ifconfig.me/ip >>/tmp/cluster_ips 2>/dev/null
done
awk '{gsub("pod \"busybox\" deleted", "", $0); print}' /tmp/cluster_ips rm /tmp/cluster_ips