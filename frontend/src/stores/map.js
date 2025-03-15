import { defineStore } from "pinia";
import dataLayerService from '@/services/dataLayerService';

import Map from "ol/Map.js";
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { OSM, TileWMS } from "ol/source";

export default defineStore("map", {
    state: () => ({
        map: null,
        visibleLayers: []
    }),
    actions: {
        initialize() {
            this.map = new Map({
                target: 'map',
                layers: [
                  new TileLayer({
                    name: "OpenStreetMap",
                    source: new OSM()
                  }),
                ],
                view: new View({
                  center: [2800000, 5750000],
                  zoom: 7.3
                }),
            });
        },
        async addLayer(layerInfo, visible = true) {
            if(!layerInfo)
                return;

            let existingLayer = this.map.getLayers().getArray().find(
                (layerItem) => layerItem.get("id") == layerInfo.id
            );
            if(existingLayer) {
                this.showLayer(layerInfo.id);
                return;
            }

            let dataLayerResponse = await dataLayerService.getDataLayer(layerInfo.id)
    
            if(!dataLayerResponse.success) {
                throw dataLayerResponse?.error ?? "Couldn't retrieve datalayer info"
            }

            if(dataLayerResponse.dataLayer == null) {
                throw "Datalayer not found"
            }

            let layer = null;
            let layerSourceType = dataLayerResponse.dataLayer.geoserver?.layer?.source;
            
            // TODO: Implement other layer source types
            switch (layerSourceType) {
                case "wms":
                    layer = new TileLayer({
                        type: "tile",
                        opacity: 100,
                        visible: visible,
                        source: new TileWMS({
                            url: dataLayerResponse.dataLayer.geoserver.url + "/wms",
                            params: {
                                FORMAT: dataLayerResponse.dataLayer.geoserver.layer.format.name,
                                LAYERS: dataLayerResponse.dataLayer.geoserver.layer.name
                            }
                        }),
                        name: dataLayerResponse.dataLayer.name,
                        id: dataLayerResponse.dataLayer.id
                    })
                    break;
                default:
                    throw "Unknown layer source type";
            }
            
            if(visible == true) {
                this.visibleLayers.push(layerInfo.id);
            }
            
            this.map.addLayer(layer);
        },
        showLayer(layerId) {
            let existingLayer = this.map.getLayers().getArray().find(
                (layerItem) => layerItem.get("id") == layerId
            );

            if(!existingLayer)
                return;

            existingLayer.setVisible(true);
            this.visibleLayers.push(layerId);
        },
        hideLayer(layerId) {
            let existingLayer = this.map.getLayers().getArray().find(
                (layerItem) => layerItem.get("id") == layerId
            );

            if(!existingLayer)
                return;

            existingLayer.setVisible(false);
            let indexOfVisibleLayer = this.visibleLayers.indexOf(layerId);

            this.visibleLayers.splice(indexOfVisibleLayer, 1);
        }
    }
})