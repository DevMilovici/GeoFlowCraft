<template>
    <PrimeDialog v-model:visible="dataSetDetailsDialogVisible" modal header="Dataset details" :style="{ width: '25rem' }" :closable="false">
        <div class="flex flex-col gap-2 mb-8">
            <!-- DataSetName -->
            <PrimeIftaLabel>
                <PrimeInputText id="name" name="name" type="text" placeholder="Name" fluid 
                    :value="selectedDataSet?.name" :disabled="true" autocomplete="off"
                />
                <label for="name">Name</label>
            </PrimeIftaLabel>
            <!-- DataSet layers -->
            <div class="flex flex-col gap-2 border border-zinc-600 rounded p-2">
                <span class="text-zinc-500">Layers</span>
                <PrimeListBox
                    :options="selectedDataSet?.layers"
                    emptyMessage="There are no layers."
                >
                    <template #option="slotProps">
                        <div class="w-full flex flex-row gap-2 items-center justify-between">
                            <div>{{ slotProps?.option?.name }}</div>
                            <div class="flex flex-row items-center">
                                <!-- Remove layer from dataset -->
                                <div>
                                    <PrimeButton 
                                        icon="pi pi-times" 
                                        severity="danger"
                                        variant="text" rounded 
                                        v-tooltip.bottom="'Remove layer from dataset'"
                                        @click="removeLayerFromDataset(slotProps?.option)"
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
                                <i class="pi pi-info-circle" v-tooltip.bottom="slotProps?.option?.description"></i>
                            </div>
                        </div>
                    </template>
                </PrimeListBox>
                <div class="w-full flex gap-2 justify-center items-center">
                    <PrimeToast />
                    <PrimeButton rounded type="button" icon="pi pi-plus" severity="success" size="small"
                        v-tooltip.bottom="'Add new layer'" variant="text" 
                        @click="showCreateDataLayerDialog" />
                    <PrimeButton rounded type="button" icon="pi pi-search-plus" severity="success" size="small"
                        v-tooltip.bottom="'Add existing layer'" variant="text" 
                        @click="showAddExistingDataLayer" />
                </div>
            </div>
        </div>
        <div class="flex justify-between">
            <PrimeButton rounded type="button" icon="pi pi-trash" severity="danger" size="large" 
                v-tooltip.right="'Delete dataset'"
                @click="showDeleteDataSetConfirmDialog" />
            <PrimeButton type="button" label="Close" severity="danger" @click="close"></PrimeButton>
        </div>
    </PrimeDialog>
</template>

<script>

import { mapState } from 'pinia';
import useDialogStore from "@/stores/dialog";
import useDataSetStore from "@/stores/dataSet";
import useMapStore from '@/stores/map';

export default {
    name: "AppDataSetDetailsDialog",
    components: {},
    data() {
        return {
            isLooading: false
        }
    },
    computed: {
        ...mapState(useDialogStore, ["dataSetDetailsDialogVisible"]),
        ...mapState(useDataSetStore, ["selectedDataSet"]),
        ...mapState(useMapStore, ["visibleLayers"])
    },
    methods: {
        showCreateDataLayerDialog() {
            const dialogStore = useDialogStore();
            dialogStore.showDataLayerCreateCatalog();
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
        async removeLayerFromDataset(layerInfo) {
            try {
                const dataSetStore = useDataSetStore();
                const removeDataLayerFromDataSetResponse = await dataSetStore.removeLayer(layerInfo.id);
                if(removeDataLayerFromDataSetResponse?.success) {
                    this.$toast.add({ severity: "success", summary: "Success", detail: "The datalayer has been successfully removed from the dataset!", life: 3000 });
                } else {
                    this.$toast.add({ severity: "error", summary: "Datalayer remove failed!", detail: `Something went wrong on the backend: "${removeDataLayerFromDataSetResponse.error}".` , life: 3000 });
                }
            } catch (error) {
                this.$toast.add({ severity: "error", summary: "Datalayer remove failed!", detail: `Something went wrong: "${error}".` , life: 3000 });
            }
        },
        async showDeleteDataSetConfirmDialog() {
            const dialogStore = useDialogStore();
            dialogStore.showConfirmDialog({
                title: "Confirm action",
                message: "Are you sure you want to delete this dataset?", 
                event: "CONFIRM_DELETE_SELECTED_DATASET" // TODO: Create an enum of events
            });
        },
        async showAddExistingDataLayer() {

        },
        close() {
            const dialogStore = useDialogStore();
            dialogStore.hideDataSetDetailsDialog();
        }
    }
}

</script>