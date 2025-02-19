import { defineStore } from 'pinia'
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`;

export default defineStore('dataSet', {
  state: () => ({
    dataSets: []
  }),
  actions: {
    async getDataSets() {
      this.dataSets.length = 0;

      let response = await axios.get(`${API_URL}/dataset`);
      
      if(response?.data?.success) {  
        this.dataSets = response.data.dataSets;
      }
      
      return this.dataSets;
    },
    async createDataSet(dataSet) {
      let response = await axios.post(`${API_URL}/dataset`, dataSet);
      let responseData = response?.data;
      if(responseData?.success) {
        this.dataSets.push(responseData.dataSet);
      }

      return responseData;
    }
  }
})
