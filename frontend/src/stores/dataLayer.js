import dataLayerService from "@/services/dataLayerService";
import { defineStore } from "pinia";

export default defineStore('dataLayer', {
    state: () => ({
        dataLayers: [],
        selectedDataLayer: null,
    }),
    actions: {
        setDataLayers(dataLayers) {
            this.dataLayers.length = 0;
            this.dataLayers.push(...dataLayers);
            this.selectedDataLayer = null;
        },
        setSelectedDataLayer(dataLayer) {
            this.selectedDataLayer = this.dataLayers.find(dl => dl.id == dataLayer.id);
        },
        async deleteDataLayer(dataLayerId) {
            let response = await dataLayerService.deleteDataLayer(dataLayerId);
            
            if(response?.success) {
                let newDataLayers = this.dataLayers.filter((dl) => dl.id != dataLayerId);
                this.dataLayers.length = 0;
                this.dataLayers.push(...newDataLayers);
            }

            return response;
        },
        async loadDataLayers() {
            const response = await dataLayerService.getDataLayers();
            if(response?.success) {
                this.setDataLayers(response.dataLayers);
            }
            return response;
        }
    }
});