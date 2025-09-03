<template>
    <PrimeDialog v-model:visible="modelProcessingSearchResultsDialog.visible" header="Search results" :closable="false">
        <!-- List of the search results -->
        <div class="mb-4">
            <div v-if="areaItems?.length > 0">
                <div class="flex flex-row gap-1 text-lg text-gray-500 border-b border-gray-500 mb-1 px-1">
                    <div class="w-[20px]"></div>
                    <div class="w-[150px] font-bold">Date</div>
                    <div class="w-[150px] font-bold">Cloud cover</div>
                    <div class="w-[200px] font-bold">ID</div>
                    <div class="w-[50px]"></div>
                </div>
                <div class="max-h-[200px] bg-gray-500/10 overflow-y-auto rounded-lg">
                    <div v-for="(item, index) in areaItems"
                        class="flex flex-row gap-1 hover:bg-gray-600 px-1"
                    >
                        <div class="w-[20px] flex items-center">
                            <PrimeCheckbox v-model="item.selected" binary size="small"></PrimeCheckbox>
                        </div>
                        <div class="w-[150px] flex items-center overflow-hidden">
                            {{ moment(item.datetime).format("YYYY-MM-DD HH:mm") }}
                        </div>
                        <div class="w-[150px] flex items-center overflow-hidden">{{ item.stac_item.properties.cloudCover }}</div>
                        <div class="w-[200px] flex items-center overflow-hidden">{{ item.id }}</div>
                        <div class="w-[50px] flex items-center">
                            <PrimeButton 
                                v-if="item.visible"
                                @click="hideAreaItemFromMap(item)"
                                icon="pi pi-eye" 
                                variant="text" rounded 
                                severity="success"
                                v-tooltip.bottom="'Hide area item from map'"
                            />
                            <PrimeButton 
                                v-else
                                @click="showAreaItemOnMap(item)"
                                icon="pi pi-eye-slash"
                                variant="text" rounded 
                                severity="danger"
                                v-tooltip.bottom="'Show area item on map'"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                There is not data.
            </div>
        </div>
        <!-- Buttons -->
        <div class="flex justify-between items-center">
            <PrimeButton label="Close" icon="pi pi-times" severity="danger"
                @click="close"
            ></PrimeButton>
            <PrimeButton label="Process" icon="pi pi-microchip" severity="success" 
                @click="process"
                v-tooltip.bottom="(areaItems?.filter(areaItem => areaItem.selected == true).length > 0) 
                                    ? 'Process the selected area item(s)' 
                                    : 'Select at least one area item to process'"
                :disabled="!(areaItems?.filter(areaItem => areaItem.selected == true).length > 0)"
            ></PrimeButton>
        </div>
        <PrimeToast />
    </PrimeDialog>
</template>

<script>
import { mapState } from 'pinia';
import useDialogStore from "@/stores/dialog";
import useCopernicusStore from "@/stores/copernicus";
import useMapStore from "@/stores/map";

import moment from 'moment';
import { transformExtent } from 'ol/proj';

export default {
    name: "AppModelProcessingSearchResultsDialog",
    components: {},
    data() {
        return {}
    },
    computed: {
        ...mapState(useDialogStore, ["modelProcessingSearchResultsDialog"]),
        ...mapState(useCopernicusStore, ["areaItems"])
    },
    methods: {
        showAreaItemOnMap(item) {
            // item.bbox is a bounding box: [minX, minY, maxX, maxY]
            // bbox coordinates are in EPSG:4326 (WGS84 longitude/latitude)
            // OpenLayers' default 
            const bboxWebMercator = transformExtent(item.bbox, 'EPSG:4326', 'EPSG:3857')
            const polygonCoordinates = [
                [bboxWebMercator[0], bboxWebMercator[1]], // bottom-left (minX, minY)
                [bboxWebMercator[2], bboxWebMercator[1]], // bottom-right (maxX, minY)
                [bboxWebMercator[2], bboxWebMercator[3]], // top-right (maxX, maxY)
                [bboxWebMercator[0], bboxWebMercator[3]], // top-left (minX, maxY)
                [bboxWebMercator[0], bboxWebMercator[1]] // close the polygon
            ]

            const mapStore = useMapStore();
            mapStore.addVectorLayer(item.id, polygonCoordinates);

            item.visible = true;
        },
        hideAreaItemFromMap(item) {
            const mapStore = useMapStore();
            mapStore.removeVectorLayer(item.id);

            item.visible = false;
        },
        process() {
            // TODO: Send processing request
            this.$toast.add({ severity: "error", summary: "ERROR", detail: `This functionality is not implemented!`, life: 3000});
        },
        close() {
            const dialogStore = useDialogStore();
            dialogStore.hideModelProcessingSearchResultsDialog();
        },
        moment(dateString) {
            return moment(dateString);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>