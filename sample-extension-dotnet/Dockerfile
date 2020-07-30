#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY sample-extension-dotnet.sln .
COPY docker-compose.dcproj .
COPY sample-extension-dotnet/sample-extension-dotnet.csproj ./sample-extension-dotnet/
RUN dotnet restore "sample-extension-dotnet/sample-extension-dotnet.csproj"

COPY sample-extension-dotnet/. ./sample-extension-dotnet/
WORKDIR "/src/sample-extension-dotnet"
RUN dotnet build "sample-extension-dotnet.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "sample-extension-dotnet.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "sample-extension-dotnet.dll"]
