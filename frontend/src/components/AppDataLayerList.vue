<template>
    <div class="flex flex-col gap-2 items-center justify-center p-1">
        <div class="flex flex-row gap-2 items-center justify-between p-2">
            <div class="flex flex-row gap-2">
                <i class="pi pi-map" style="font-size: 1.5rem;"></i>
                <span class="w-full text-center">
                    Visible datalayers
                </span>
            </div>
        </div>
        <div class="flex flex-col gap-1 w-full">
            <PrimeListBox
                v-model="selectedDataLayer" :options="visibleLayers"
                optionLabel="name" class="w-full"
            >
                <template #option="slotProps">
                    <div class="w-full flex flex-row gap-2 justify-between items-center">
                        <div v-if="slotProps.option.get('name').length > 19" v-tooltip.left="slotProps.option.get('name')" class="truncate">{{ slotProps.option.get("name") }}</div>
                        <div v-else>{{ slotProps.option.get("name") }}</div>
                        <div>
                            <PrimeButton 
                                icon="pi pi-times" 
                                variant="text" rounded 
                                severity="danger"
                                v-tooltip.left="'Remove layer from map'"
                                @click="removeLayer(slotProps.option.get('id'))"
                            />
                        </div>
                    </div>
                </template>
            </PrimeListBox>
        </div>
        <div>
            <PrimeButton label="Datalayers catalog" icon="pi pi-map" @click="showDataLayersCatalog"/>
        </div>
    </div>
</template>

<script>

import { mapStores } from 'pinia';

import useMapStore from "@/stores/map";
import useDialogStore from "@/stores/dialog";
import useDataLayerStore from "@/stores/dataLayer";

export default {
    name: "AppDataLayerList",
    data() {
        return {
            selectedDataLayer: null,
        }
    },
    computed: {
        ...mapStores(useMapStore, useDialogStore, useDataLayerStore),
        visibleLayers() {
            return this.mapStore?.map
                ?.getLayers()
                ?.getArray()
                ?.filter(
                    (layerItem) => (
                            layerItem.get("custom") == true &&
                            layerItem.getProperties().visible == true
                    )
                )
                ?.slice();
        }
    },
    methods: {
        removeLayer(layerId) {
            try {
                const mapStore = useMapStore();
                mapStore.hideLayer(layerId);
            } catch (error) {
                this.$toast.add({ severity: "error", summary: "Datalayer removing failed!", detail: `Something went wrong: "${error}".` , life: 3000 });
            }
        },
        async showDataLayersCatalog() {
            await this.dataLayerStore.loadDataLayers();
            this.dialogStore.showDataLayersDialog();
        }
    }
}

</script>