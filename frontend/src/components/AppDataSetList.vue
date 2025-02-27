<template>
    <div class="flex flex-col items-center justify-center p-1">
        <div class="flex flex-row gap-2 items-center justify-between p-2">
            <div class="flex flex-row gap-2">
                <i class="pi pi-database" style="font-size: 1.5rem;"></i>
                <span class="w-full text-center">
                    Datasets
                </span>
            </div>
            <PrimeButton rounded type="button" icon="pi pi-plus" severity="success" size="small"
                v-tooltip.bottom="'Create dataset'" @click="showCreateDataSetCatalog" />
        </div>
        <div class="flex flex-col gap-1 w-full">
            <PrimeListBox 
                v-model="selectedDataSet" :options="dataSets" 
                @update:modelValue="displayDataSetDetails"
                optionLabel="name" fluid class="w-full"
            >
                <template #option="slotProps">
                    <div class="flex items-center">
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </PrimeListBox>
        </div>
    </div>
</template>

<script>
import useDataSetStore from "@/stores/dataSet";
import useDialogStore from "@/stores/dialog";

import dataSetService from "@/services/dataSetService";

export default {
    name: "AppDataSetList",
    data() {
        return {
            dataSets: [],
            selectedDataSet: null,
        }
    },
    computed: {},
    emits: ["displayDataSetDetails"],
    async mounted() {
        const dataSetStore = useDataSetStore();

        const response = await dataSetService.getDataSets();
        if(response?.success) {  
            this.dataSets = response.dataSets;
            dataSetStore.dataSets = response.dataSets;
        }
    },
    methods: {
        showCreateDataSetCatalog() {
            const dialogStore = useDialogStore();
            dialogStore.showDataSetCreateDialog();
        },
        displayDataSetDetails() {
            if(this.selectedDataSet == null)
                return;
            
            const dataSetStore = useDataSetStore();
            dataSetStore.setSelectedDataSet(this.selectedDataSet);

            const dialogStore = useDialogStore();
            dialogStore.showDataSetDetailsDialog();
        }
    }
}

</script>

<style lang="scss">

</style>