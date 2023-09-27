#!/usr/bin/pwsh
$ErrorActionPreference = 'silentlycontinue'

$ZONES = $(kubectl get nodes -o jsonpath='{.items[*].metadata.labels.topology\.kubernetes\.io/zone}').Split(" ")
$ZONES = $ZONES | Select-Object -Unique

Write-Output "Detected zones:"
Write-Output "---------------"
foreach ($zone in $ZONES) { 
    Write-Output $zone
}

foreach ($zone in $ZONES) { 
    $overrides = @{
        "apiVersion" = "v1"
        "metadata"   = @{
            "labels" = @{
                "sidecar.istio.io/inject" = "false"
            }
            "spec"   = @{
                "nodeSelector" = @{
                    "topology.kubernetes.io/zone" = $zone
                }
            }
        }
    } | ConvertTo-Json -EscapeHandling EscapeHtml -Depth 5 
    
    kubectl run -i --tty busybox --image=curlimages/curl --restart=Never --overrides=$overrides --rm --command -- curl 'http://ifconfig.me/ip' | Out-File -FilePath $env:TEMP/cluster_ips -Append
}

(Get-Content $env:TEMP/cluster_ips) -replace 'pod "busybox" deleted', '' | Set-Content $env:TEMP/cluster_ips 

Write-Host
Write-Output "Detected IPs:"
Write-Output "-------------"
Get-Content $env:TEMP/cluster_ips

Remove-Item $env:TEMP/cluster_ips