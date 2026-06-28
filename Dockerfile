# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY RAAS.sln ./
COPY src/RAAS.Domain/RAAS.Domain.csproj src/RAAS.Domain/
COPY src/RAAS.Application/RAAS.Application.csproj src/RAAS.Application/
COPY src/RAAS.Infrastructure/RAAS.Infrastructure.csproj src/RAAS.Infrastructure/
COPY src/RAAS.Api/RAAS.Api.csproj src/RAAS.Api/

RUN dotnet restore src/RAAS.Api/RAAS.Api.csproj

COPY src/ src/
RUN dotnet publish src/RAAS.Api/RAAS.Api.csproj -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "RAAS.Api.dll"]
