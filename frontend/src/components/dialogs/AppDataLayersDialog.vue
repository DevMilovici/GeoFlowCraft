<template>
    <PrimeDialog v-model:visible="dataLayersDialogVisible" modal header="Datalayers" :style="{ width: '25rem' }" :closable="false">
        <div class="mb-8">
            <!-- TODO: Input search filter -->
            <PrimeListBox 
                :options="dataLayerStore.dataLayers"
                emptyMessage="There are no data layers."
            >
                <template #option="slotProps">
                    <div class="w-full flex flex-row gap-2 items-center justify-between">
                        <!-- Layer name -->
                        <div v-if="slotProps?.option?.name?.length >= 19" v-tooltip.bottom="slotProps?.option?.name" class="truncate">{{ slotProps?.option?.name }}</div>
                        <div v-else :v-tooltip.bottom="slotProps?.option?.name" class="truncate">{{ slotProps?.option?.name }}</div>
                        <div class="flex flex-row gap-1 items-center">
                            <!-- Delete layer -->
                            <div>
                                <PrimeButton 
                                    icon="pi pi-trash" 
                                    severity="danger"
                                    variant="text" rounded 
                                    v-tooltip.bottom="'Delete layer'"
                                    @click="deleteLayer(slotProps?.option)"
                                />
                            </div>
                            <!-- Show/Hide layer -->
                            <div>
                                <!-- Show layer on map button -->
                                <PrimeButton 
                                    v-if="visibleLayers?.indexOf(slotProps?.option?.id) >= 0"
                                    icon="pi pi-eye" 
                                    variant="text" rounded 
                                    v-tooltip.bottom="'Hide layer'"
                                    @click="hideLayerOnMap(slotProps?.option)"
                                />
                                <!-- Remove (hide) layer from map button -->
                                <PrimeButton 
                                    v-else
                                    icon="pi pi-eye-slash"
                                    severity="danger"
                                    variant="text" rounded 
                                    v-tooltip.bottom="'Show layer on map'"
                                    @click="showLayerOnMap(slotProps?.option)"
                                />
                            </div>
                            <!-- Layer info/description -->
                            <div class="flex items-center pl-2">
                                <i v-if="slotProps?.option?.description?.length > 0" class="pi pi-info-circle" v-tooltip.bottom="slotProps?.option?.description"></i>
                                <i v-else class="pi pi-info-circle text-gray-600" v-tooltip.bottom="'There is no information.'"></i>
                            </div>
                        </div>
                    </div>
                </template>
            </PrimeListBox>
        </div>
        <div class="flex justify-end">
            <PrimeButton type="button" label="Close" severity="danger" @click="close"></PrimeButton>
        </div>
        <PrimeToast />
    </PrimeDialog>
</template>

<script>

import { mapState, mapStores } from "pinia";
import useDialogStore from "@/stores/dialog";
import useDataLayerStore from "@/stores/dataLayer";
import useMapStore from "@/stores/map";

export default {
    name: "AppDataLayersDialog",
    components: {},
    data() {
        return {}
    },
    computed: {
        ...mapStores(useDataLayerStore),
        ...mapState(useDialogStore, ["dataLayersDialogVisible"]),
        ...mapState(useMapStore, ["visibleLayers"])
    },
    async mounted() {
        try {
            const dataLayerStore = useDataLayerStore();
            const response = await dataLayerStore.loadDataLayers();
            if(response?.success) {
            } else {
                this.$toast.add({ severity: "error", summary: "Failed loading datalayers!", detail: `Something went wrong on the backend side: ${response.error}`, life: 3000 });
            }
        } catch (error) {
            this.$toast.add({ severity: "error", summary: "Failed loading datalayers!", detail: error ?? "Something went wrong.", life: 3000 });
            console.log(error)
        }
    },
    methods: {
        async close() {
            const dialogStore = useDialogStore();
            dialogStore.hideDataLayersDialog();
        },
        async deleteLayer(layerInfo) {
            try {
                const dataLayerStore = useDataLayerStore();
                dataLayerStore.setSelectedDataLayer(layerInfo);

                const dialogStore = useDialogStore();
                dialogStore.showConfirmDialog({
                    title: "Confirm action",
                    message: "Are you sure you want to delete this datalayer?",
                    event: "DELETE_SELECTED_DATALAYER" // TODO: Create an enum of events
                });
            } catch (error) {
                this.$toast.add({ severity: "error", summary: "Failed deleting datalayer!", detail: `Something went wrong.`, life: 3000 });
            }
        },
        async showLayerOnMap(layerInfo) {
            try {                
                const mapStore = useMapStore();
                await mapStore.addLayer({ id: layerInfo.id }, true);
            } catch (error) {
                this.$toast.add({ severity: "error", summary: "Datalayer display failed!", detail: `Something went wrong: "${error}".` , life: 3000 });
            }
        },
        async hideLayerOnMap(layerInfo) {
            try {
                const mapStore = useMapStore();
                mapStore.hideLayer(layerInfo.id);
            } catch (error) {
                this.$toast.add({ severity: "error", summary: "Datalayer hide failed!", detail: `Something went wrong: "${error}".` , life: 3000 });
            }
        },
    }
}

</script>