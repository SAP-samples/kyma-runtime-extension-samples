Work In Progress

- pip install grpcio-tools
- python -m grpc_tools.protoc -I./ --python_out=. --grpc_python_out=. orders.proto

- export _GRPC_TOKEN_="12345"
- export _DEV_="true"
- kubectl apply -f deployment.yaml -n grpc

- pip3 freeze > requirements.txt
