
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copy project file
COPY ["APIs/APITasks/APITasks/APITasks/APITasks.csproj", "APITasks/"]

# Restore NuGet packages
RUN dotnet restore "APITasks/APITasks.csproj"

# Copy the remaining project files
COPY ["APIs/APITasks/APITasks/APITasks/", "APITasks/"]

# Build the application
WORKDIR /src/APITasks
RUN dotnet publish "APITasks.csproj" -c Release -o /app/publish /p:UseAppHost=false


# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

# Configure the application port
ENV ASPNETCORE_HTTP_PORTS=8080

EXPOSE 8080

# Copy published application
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "APITasks.dll"]

