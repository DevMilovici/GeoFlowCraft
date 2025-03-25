import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

export default {
    async getDataSets() {
        let response = await axios.get(`${API_URL}/dataset`);
        return response.data;
    },
    async getDataSet(dataSetId) {
        let respoonse = await axios.get(`${API_URL}/dataset/${dataSetId}`);
        return respoonse.data;
    },
    async createDataSet(dataSet) {
        let response = await axios.post(`${API_URL}/dataset`, dataSet);
        return response.data;
    },
    async removeDataLayer(dataSetId, dataLayerId) {
        let response = await axios.delete(`${API_URL}/dataset/datalayer`, {
            data: {
                dataSetId: dataSetId,
                dataLayerId: dataLayerId
            }
        });
        return response.data;
    }
}