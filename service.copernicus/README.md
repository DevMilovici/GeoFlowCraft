This is a REST API, written in python (3.11.9), that receives a geojson representing a multipolygon which will be then used to download "sentinel-2-l2a" data from Copernicus (https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Catalog/Examples.html) from the area described by the multipoligon.
The authentication using the OAuth client credentials from the .env file in this directory.
The data will be downloaded in .SAFE format.
The product catalogue will be STAC: https://documentation.dataspace.copernicus.eu/APIs/STAC.html

## Run the application directly with locally installed python:
```
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Run using Docker:
```
docker build -t copernicus-api .
docker run -p 8000:8000 --env-file .env copernicus-api
```