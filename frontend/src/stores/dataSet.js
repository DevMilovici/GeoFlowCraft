import { defineStore } from 'pinia'
import dataSetService from '@/services/dataSetService';

export default defineStore('dataSet', {
  state: () => ({
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
    async setSelectedDataSet(dataSet) {
      console.log('setSelectedDataSet(dataSet)')
      console.log(dataSet);
      let response = await dataSetService.getDataSet(dataSet._id);
      console.log(response);
      if(response.success) {
        this.selectedDataSet = response.dataSet;
        console.log(this.selectedDataSet)
      }
    }
  }
})
