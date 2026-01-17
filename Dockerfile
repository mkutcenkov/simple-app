# Stage 1: Build the React Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY simple-app-client/package.json simple-app-client/package-lock.json ./
RUN npm install
COPY simple-app-client/ ./
RUN npm run build

# Stage 2: Build the .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src
COPY SimpleApp.sln ./
COPY SimpleApp.Api/SimpleApp.Api.csproj SimpleApp.Api/
RUN dotnet restore SimpleApp.Api/SimpleApp.Api.csproj
COPY SimpleApp.Api/ SimpleApp.Api/
WORKDIR /src/SimpleApp.Api
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish .
# Copy the built React app to the wwwroot folder of the published .NET app
COPY --from=frontend-build /app/build ./wwwroot

# Expose the port the app runs on
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "SimpleApp.Api.dll"]
