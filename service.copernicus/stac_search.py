import requests
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging
from shapely.geometry import shape, MultiPolygon
import json

logging.basicConfig(level = logging.INFO)
logger = logging.getLogger(__name__)

class STACSearch:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.stac_url = "https://catalogue.dataspace.copernicus.eu/stac"
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
    
    def search_sentinel2(
        self,
        geometry: Dict[str, Any],
        start_date: str,
        end_date: str,
        max_cloud_cover: float = 20.0,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        
        try:
            if isinstance(start_date, datetime):
                start_date = start_date.strftime('%Y-%m-%dT%H:%M:%SZ')
            elif isinstance(start_date, str) and not start_date.endswith('Z'):
                try:
                    dt = datetime.fromisoformat(start_date.replace('Z', ''))
                    start_date = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
                except:
                    start_date = start_date
            
            if isinstance(end_date, datetime):
                end_date = end_date.strftime('%Y-%m-%dT%H:%M:%SZ')
            elif isinstance(end_date, str) and not end_date.endswith('Z'):
                try:
                    dt = datetime.fromisoformat(end_date.replace('Z', ''))
                    end_date = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
                except:
                    end_date = end_date
            
            # Convert MultiPolygon to bbox for now (Copernicus STAC may not support intersects)
            from shapely.geometry import shape
            geom = shape(geometry)
            bbox = list(geom.bounds)  # [minx, miny, maxx, maxy]
            
            search_body = {
                "collections": ["SENTINEL-2"],
                "datetime": f"{start_date}/{end_date}",
                "bbox": bbox,
                "limit": limit
            }
            
            logger.info(f"Searching STAC catalog with date range: {start_date} to {end_date}")
            
            response = requests.post(
                f"{self.stac_url}/search",
                json=search_body,
                headers=self.headers
            )
            
            if response.status_code != 200:
                logger.error(f"STAC search response: {response.status_code} - {response.text}")
            
            response.raise_for_status()
            
            results = response.json()
            items = results.get("features", [])
            
            logger.info(f"Found {len(items)} Sentinel-2 products")
            
            filtered_items = []
            for item in items:
                item_info = {
                    "id": item["id"],
                    "datetime": item["properties"].get("datetime"),
                    "cloud_cover": item["properties"].get("eo:cloud_cover"),
                    "platform": item["properties"].get("platform"),
                    "bbox": item.get("bbox"),
                    "assets": self._get_relevant_assets(item.get("assets", {})),
                    "stac_item": item
                }
                filtered_items.append(item_info)
            
            return filtered_items
            
        except requests.exceptions.RequestException as e:
            logger.error(f"STAC search failed: {str(e)}")
            raise Exception(f"Failed to search STAC catalog: {str(e)}")
    
    def _get_relevant_assets(self, assets: Dict[str, Any]) -> Dict[str, str]:
        relevant_assets = {}
        
        band_names = [
            "B01", "B02", "B03", "B04", "B05", "B06", 
            "B07", "B08", "B8A", "B09", "B11", "B12",
            "visual", "true_color", "SCL", "AOT", "WVP"
        ]
        
        for band in band_names:
            if band in assets:
                relevant_assets[band] = assets[band].get("href", "")
            elif band.lower() in assets:
                relevant_assets[band] = assets[band.lower()].get("href", "")
        
        for key, asset in assets.items():
            if "tif" in key.lower() or "geotiff" in key.lower():
                relevant_assets[key] = asset.get("href", "")
        
        return relevant_assets
    
    def get_product_metadata(self, product_id: str) -> Dict[str, Any]:
        try:
            response = requests.get(
                f"{self.stac_url}/collections/SENTINEL-2/items/{product_id}",
                headers=self.headers
            )
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get product metadata: {str(e)}")
            raise Exception(f"Failed to get product metadata: {str(e)}")