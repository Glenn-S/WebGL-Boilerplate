#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["WebGL Boilerplate/WebGL Boilerplate.csproj", "WebGL Boilerplate/"]
RUN dotnet restore "WebGL Boilerplate/WebGL Boilerplate.csproj"
COPY . .
WORKDIR "/src/WebGL Boilerplate"
RUN dotnet build "WebGL Boilerplate.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebGL Boilerplate.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebGL Boilerplate.dll"]