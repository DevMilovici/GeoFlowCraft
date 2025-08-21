<template>
    <PrimeDialog v-model:visible="modelProcessingRequestDialog.visible" header="Send model processing request" :closable="false">
        <div class="my-2 mb-6 flex flex-col gap-1">
            <!-- Model select input -->
            <PrimeSelect v-model="modelProcessingRequestDialog.selectedModel" :options="availableModels" 
                optionLabel="name" placeholder="Select a model"
                class="w-full mb-2" :disabled="isLoading"
            />
            <!-- Date ragne input -->
            <div class="w-full pl-3 text-start text-gray-400">Select the time interval</div>
            <PrimeDatePicker 
                v-model="modelProcessingRequestDialog.selectedDates" :disabled="isLoading" 
                selectionMode="range" showIcon fluid 
            />
        </div>
        <div class="flex justify-between items-center">
            <PrimeButton label="Discard" icon="pi pi-times" severity="danger" 
                @click="discard" :disabled="isLoading"
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
import useDialogStore from "@/stores/dialog";
import { mapState } from "pinia";

export default {
    name: "AppModelProcessingRequestDialog",
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
        ...mapState(useDialogStore, ["modelProcessingRequestDialog"])
    },
    methods: {
        discard() {
            const dialogStore = useDialogStore();
            dialogStore.hideModelProcessingRequestDialog();
        },
        confirm() { 
            // TODO: Validation
            // TODO: Create and send request
            // WARN: The request will take several minutes to finish
            this.$toast.add({ severity: "error", summary: "ERROR", detail: `This feature is not yet implemented!` , life: 3000 });
            console.log("confirm()"); 
            console.log(this.modelProcessingRequestDialog.selectedModel);
            console.log(this.modelProcessingRequestDialog.selectedDates);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>