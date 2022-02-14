FROM mcr.microsoft.com/dotnet/aspnet:6.0

COPY TodoApi/bin/Release/net6.0/publish/ App/

WORKDIR /App

ENV DOTNET_EnableDiagnostics=0

ENTRYPOINT ["dotnet", "TodoApi.dll"]