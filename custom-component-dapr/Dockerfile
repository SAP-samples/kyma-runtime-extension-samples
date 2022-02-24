# To enable ssh & remote debugging on app service change the base image to the one below 
# FROM mcr.microsoft.com/azure-functions/node:4-node16-appservice 
FROM mcr.microsoft.com/azure-functions/node:4-node16 

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \ 
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \ 
    AzureWebJobsDisableHomepage=true \ 
    ASPNETCORE_URLS=http://*:7080 

COPY . /home/site/wwwroot 

RUN cd /home/site/wwwroot && \ 
    npm install