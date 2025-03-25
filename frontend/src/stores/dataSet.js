import { defineStore } from 'pinia'
import dataSetService from '@/services/dataSetService';
import dataLayerService from '@/services/dataLayerService';

export default defineStore('dataSet', {
  state: () => ({
    dataSets: [],
    selectedDataSet: null
  }),
  actions: {
    async createDataSet(dataSet) {
      let response = await dataSetService.createDataSet(dataSet);

      if(response?.success) {
        this.dataSets.push(response.dataSet);
      }

      return response;
    },
    setDataSets(dataSets) {
      this.dataSets.length = 0;
      this.dataSets.push(...dataSets);
    },
    async loadDataSets() {
      const response = await dataSetService.getDataSets();
      if(response?.success) {
        this.setDataSets(response.dataSets);
        if(this.selectedDataSet) {
          await this.loadDataSet(this.selectedDataSet)
        }
      }
      return response;
    },
    async loadDataSet(dataSet) {
      let response = await dataSetService.getDataSet(dataSet.id);
      if(response?.success) {
        this.selectedDataSet = response.dataSet;
      }
      return response;
    },
    async createDataLayerForDataSet(createDataLayerRequest) {
      const response = await dataLayerService.createDataLayer(createDataLayerRequest);

      if(response.success) {
        await this.loadDataSets();
      }

      return response;
    },
    async removeLayer(layerId) {
      const response = await dataSetService.removeDataLayer(this.selectedDataSet?.id, layerId);

      if(response.success) {
        await this.loadDataSets();
      }

      return response;
    }
  }
})
