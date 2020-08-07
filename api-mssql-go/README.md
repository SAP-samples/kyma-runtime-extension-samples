export MYAPP_USER=sa  
export MYAPP_PASSWORD=Yukon900  
export MYAPP_DATABASE=DemoDB  
export MYAPP_SERVER=localhost  
export MYAPP_PORT=1433

go run .



docker build -t  <docker id>/api-mssql-go -f docker/Dockerfile .  
docker push  <docker id>/api-mssql-go