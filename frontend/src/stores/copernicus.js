import { defineStore } from "pinia";
import copernicusService from "@/services/copernicus";

export default defineStore('copernicus', {
    state: () => ({
        areaItems: []
    }),
    actions: {
        setAreaItems(items) {
            this.areaItems.length = 0;
            this.areaItems.push(...items);
        },
        async search(geojson, startDate, endDate) {
            let searchResponse = await copernicusService.search(geojson, startDate, endDate);

            if(searchResponse.status == "success") {
                for (let areaItem of searchResponse.items) {
                    areaItem.selected = false;
                    areaItem.visible = false;
                }
                this.setAreaItems(searchResponse.items)
            }

            return searchResponse
        }
    }
})