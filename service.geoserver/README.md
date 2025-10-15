## Basic commands to run an instance of Geoserver

### 1. Postgres (+ postgis)

```BASH
docker run --name geoserver_db -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgis/postgis
```

### 2. Geoserver


```BASH
docker run -d -p 5433:8080 -v ${PWD}/data_geoserver:/opt/geoserver/data_dir --name geoserver --link geoserver_db:geoserver_db -e DB_BACKEND=POSTGRES -e HOST=geoserver_db -e POSTGRES_PORT=5432 -e POSTGRES_DB=gis -e POSTGRES_USER=postgres -e POSTGRES_PASS=postgres -e GEOSERVER_ADMIN_USER=admin -e GEOSERVER_ADMIN_PASSWORD=admin -e TOMCAT_USER=admin -e TOMCAT_PASS=admin kartoza/geoserver -e CSRF_WHITELIST="localhost:8081"
```