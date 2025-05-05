FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/EventManagement.Web.Host/EventManagement.Web.Host.csproj", "src/EventManagement.Web.Host/"]
COPY ["src/EventManagement.Web.Core/EventManagement.Web.Core.csproj", "src/EventManagement.Web.Core/"]
COPY ["src/EventManagement.Application/EventManagement.Application.csproj", "src/EventManagement.Application/"]
COPY ["src/EventManagement.Core/EventManagement.Core.csproj", "src/EventManagement.Core/"]
COPY ["src/EventManagement.EntityFrameworkCore/EventManagement.EntityFrameworkCore.csproj", "src/EventManagement.EntityFrameworkCore/"]
WORKDIR "/src/src/EventManagement.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/EventManagement.Web.Host", "src/EventManagement.Web.Host"]
COPY ["src/EventManagement.Web.Core", "src/EventManagement.Web.Core"]
COPY ["src/EventManagement.Application", "src/EventManagement.Application"]
COPY ["src/EventManagement.Core", "src/EventManagement.Core"]
COPY ["src/EventManagement.EntityFrameworkCore", "src/EventManagement.EntityFrameworkCore"]
WORKDIR "/src/src/EventManagement.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "EventManagement.Web.Host.dll"]
