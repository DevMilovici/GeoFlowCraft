<template>
    <PrimeDialog v-model:visible="modelProcessingSearchRequestDialog.visible" modal header="Search available data for the selected area" :closable="false">
        <div class="my-2 mb-6 flex flex-col gap-1">
            <!-- Date range input -->
            <div class="w-full pl-3 text-start text-gray-400">Select the time interval</div>
            <PrimeDatePicker 
                v-model="modelProcessingSearchRequestDialog.requestInfo.selectedDates" :disabled="isLoading" 
                selectionMode="range" showIcon fluid 
            />
        </div>
        <div class="flex justify-between items-center">
            <PrimeButton label="Close" icon="pi pi-times" severity="danger" 
                @click="close" :disabled="isLoading"
            />
            <div>
                <i v-show="isLoading" class="pi pi-spin pi-spinner text-yellow-300" style="font-size: 2rem"></i>
            </div>
            <PrimeButton label="Confirm" icon="pi pi-check" severity="success" 
                @click="confirm" :disabled="isLoading"
            />
        </div>
        <PrimeToast />
    </PrimeDialog>
</template>

<script>
import { mapState } from "pinia";
import useDialogStore from "@/stores/dialog";
import useCopernicusStore from "@/stores/copernicus";

export default {
    name: "AppModelProcessingSearchRequestDialog",
    components: { },
    data() {
        return { 
            isLoading: false,
            availableModels: [
                { id: '1', name: 'Model 1' },
                { id: '2', name: 'Model 2' },
                { id: '3', name: 'Model 3' },
                { id: '4', name: 'Model 4' }
            ]
        }
    },
    computed: {
        ...mapState(useDialogStore, ["modelProcessingSearchRequestDialog"])
    },
    methods: {
        close() {
            const dialogStore = useDialogStore();
            dialogStore.hideModelProcessingSearchRequestDialog();
        },
        async confirm() { 
            this.isLoading = true;

            // TODO: Validation
            console.log("TODO: Validation")

            // Send search request
            const copernicusStore = useCopernicusStore();
            let searchResponse = await copernicusStore.search(
                this.modelProcessingSearchRequestDialog.requestInfo.geoJson,
                this.modelProcessingSearchRequestDialog.requestInfo.selectedDates[0],
                this.modelProcessingSearchRequestDialog.requestInfo.selectedDates[1]
            );
            
            // Display available data
            if(searchResponse.status == "success") {
                if(searchResponse.items?.length > 0) {
                    const dialogStore = useDialogStore();
                    // Display results dialog
                    dialogStore.showModelProcessingSearchResultsDialog();
                    // Hide search dialog
                    this.close();
                } else {
                    this.$toast.add({ severity: "warn", summary: "WARNING", detail: `There is no data for the selected area and time interval!`, life: 3000});
                }
            } else {
                this.$toast.add({ severity: "error", summary: "ERROR", detail: `Something went wrong!`, life: 3000});
            }

            // TODO: Create and send dowload request
            // WARN: The request will take several minutes to finish
            // TODO: Create and send model processing request

            this.isLoading = false;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>