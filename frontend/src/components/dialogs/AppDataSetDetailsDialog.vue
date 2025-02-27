<template>
    <PrimeDialog v-model:visible="dataSetDetailsDialogVisible" modal header="Dataset details" :style="{ width: '25rem' }" :closable="false">
        <div class="flex flex-col gap-2 mb-8">
            <!-- DataSetName -->
            <PrimeIftaLabel>
                <PrimeInputText id="name" name="name" type="text" placeholder="Name" fluid 
                    :value="selectedDataSet?.name" :disabled="false" autocomplete="off"
                />
                <label for="name">Name</label>
            </PrimeIftaLabel>
            <!-- DataSet layers -->
            <div class="flex flex-col gap-2 border border-zinc-600 rounded p-2">
                <span class="text-zinc-500">Layers</span>
                <PrimeListBox
                    :options="selectedDataSet?.layers"
                >
                    <template #option="slotProps">
                        <div class="w-full flex flex-row gap-2 items-center justify-between">
                            <div>{{ slotProps?.option?.name }}</div>
                            <div class="flex flex-row items-center">
                                <i class="pi pi-info-circle" v-tooltip.bottom="slotProps?.option?.description"></i>
                            </div>
                        </div>
                    </template>
                </PrimeListBox>
                <div class="w-full flex gap-2 justify-center items-center">
                    <PrimeButton rounded type="button" icon="pi pi-plus" severity="success" size="small"
                        v-tooltip.bottom="'Add new layer'" variant="text" 
                        @click="" />
                    <PrimeButton rounded type="button" icon="pi pi-search-plus" severity="success" size="small"
                        v-tooltip.bottom="'Add existing layer'" variant="text" 
                        @click="" />
                </div>
            </div>
        </div>
        <div class="flex justify-end">
            <PrimeButton type="button" label="Close" severity="danger" @click="close"></PrimeButton>
        </div>
    </PrimeDialog>
</template>

<script>

import { mapState } from 'pinia';
import useDialogStore from "@/stores/dialog";
import useDataSetStore from "@/stores/dataSet";

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
        ...mapState(useDataSetStore, ["selectedDataSet"])
    },
    methods: {
        close() {
            const dialogStore = useDialogStore();
            dialogStore.hideDataSetDetailsDialog();
        }
    }
}

</script>