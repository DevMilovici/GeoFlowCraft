import axios from "axios";

const API_URL = `${import.meta.env.VITE_COPERNICUS_SERVICE_API_URL}`;

export default {
    async search(geojson, startDate, endDate) {
        let response = await axios.post(`${API_URL}/search`, {
            start_date: startDate,
            end_date: endDate,
            geojson: geojson
        });

        return response.data;
    }
}