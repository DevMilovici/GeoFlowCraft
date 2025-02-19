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
            <PrimeListBox v-model="selectedDataSet" :options="dataSets" optionLabel="name" fluid class="w-full">
                <template #option="slotProps">
                    <div class="flex items-center">
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </PrimeListBox>
        </div>
    </div>
    <div class="w-full flex gap-1 items-center justify-center">
        <!-- Display data set information -->
        <PrimeButton :disabled="selectedDataSet === null" type="button" severity="info" label="Details" icon="pi pi-eye"
            size="small" class="text-xs" />
    </div>
</template>

<script>
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
        dataSets() {
            const dataSetStore = useDataSetStore();
            return dataSetStore.dataSets;
        }
    },
    async mounted() {
        const dataSetStore = useDataSetStore();
        this.dataSets.length = 0;
        this.dataSets.push(...await dataSetStore.getDataSets());
    },
    methods: {
        showCreateDataSetCatalog() {
            const dialogStore = useDialogStore();
            dialogStore.showDataSetCreateDialog();
        }
    }
}

</script>

<style lang="scss">

</style>