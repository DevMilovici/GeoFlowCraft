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
                v-model="selectedDataSet" :options="dataSetStore.dataSets" 
                @update:modelValue="displayDataSetDetails"
                optionLabel="name" fluid class="w-full"
            >
                <template #option="slotProps">
                    <div class="flex items-center w-full">
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </PrimeListBox>
        </div>
        <PrimeToast />
    </div>
</template>

<script>

import { mapStores } from "pinia";

import useDataSetStore from "@/stores/dataSet";
import useDialogStore from "@/stores/dialog";

export default {
    name: "AppDataSetList",
    data() {
        return {
            selectedDataSet: null,
        }
    },
    computed: {
        ...mapStores(useDataSetStore, useDialogStore)
    },
    emits: ["displayDataSetDetails"],
    async mounted() {
        try {
            const dataSetStore = useDataSetStore();
            const response = await dataSetStore.loadDataSets();
            if(response?.success) { 
            } else {
                this.$toast.add({ severity: "error", summary: "Failed loading datasets!", detail: `Something went wrong on the backend side: ${response.error}`, life: 3000 });
            }
        } catch (error) {
            this.$toast.add({ severity: "error", summary: "Failed loading datasets!", detail: error ?? "Something went wrong.", life: 3000 });
            console.log(error)
        }
    },
    methods: {
        showCreateDataSetCatalog() {
            this.dialogStore.showDataSetCreateDialog();
        },
        async displayDataSetDetails() {
            try {                
                if(this.selectedDataSet == null)
                    return;
            
                const loadDataSetReponse = await this.dataSetStore.loadDataSet(this.selectedDataSet);
                if(loadDataSetReponse.success) {
                    this.dialogStore.showDataSetDetailsDialog();
                } else {
                    this.$toast.add({ severity: "error", summary: "Failed loading dataset!", detail: `Something went wrong on the backend side: ${loadDataSetReponse.error}`, life: 3000 });
                }
            } catch (error) {
                this.$toast.add({ severity: "error", summary: "Failed loading dataset!", detail: `Something went wrong: ${error}`, life: 3000 });
            }
        }
    }
}

</script>

<style lang="scss">

</style>