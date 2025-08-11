import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

export default {
    async getDataLayers() {
        let response = await axios.get(`${API_URL}/datalayer`);
        return response.data;
    },
    async getDataLayer(dataLayerId) {
        let response = await axios.get(`${API_URL}/datalayer/${dataLayerId}`);
        return response.data;
    },
    async createDataLayer(file, dataLayer) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("metadata", JSON.stringify(dataLayer));
        let response = await axios.post(`${API_URL}/datalayer`, formData);
        return response.data;
    },
    async deleteDataLayer(dataLayerId) {
        let response = await axios.delete(`${API_URL}/datalayer`, {
            data: {
                id: dataLayerId
            }
        });
        return response.data;
    }
}