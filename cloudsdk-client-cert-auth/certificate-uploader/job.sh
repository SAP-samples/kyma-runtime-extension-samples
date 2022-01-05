#!/bin/bash

set -e

TOKEN=$(curl -X POST -u "${clientid}:${clientsecret}" -d "grant_type=client_credentials" "${url}/oauth/token" | jq -r '.access_token')

CERTIFICATE_BASE64=$(base64 -w 0 "${CERTIFICATE_PATH}")

curl --location --request POST "${uri}/destination-configuration/v1/subaccountCertificates" \
--header "Authorization: Bearer ${TOKEN}" \
--header 'Content-Type: application/json' \
--data-raw '{
  "Name": "'"$CERTIFICATE_NAME"'",
  "Type": "P12",
  "Content": "'"${CERTIFICATE_BASE64}"'"
}'