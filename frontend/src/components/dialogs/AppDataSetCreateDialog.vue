<template>
    <PrimeDialog v-model:visible="dataSetCreateDialogVisible" modal header="Create new dataset" :style="{ width: '25rem' }" :closable="false">
        <div class="flex flex-col gap-2 mb-8">
            <div>
                <PrimeInputText name="name" type="text" placeholder="Name" fluid />
            </div>
            <div>
                <PrimeTextarea name="description" placeholder="Description" class="w-full"
                    rows="6" style="resize: none"
                />
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <PrimeButton type="button" label="Cancel" severity="secondary" @click="close"></PrimeButton>
            <PrimeButton type="button" label="Create" @click="close"></PrimeButton>
        </div>
    </PrimeDialog>
</template>

<script>

import { mapState } from "pinia";
import useDialogStore from "@/stores/dialog";

export default {
    name: "AppDataSetCreateDialog",
    components: { },
    data() {
        return { visible: true }
    },
    computed: {
        ...mapState(useDialogStore, ["dataSetCreateDialogVisible"])
    },
    methods: {
        close() {
            const dialogStore = useDialogStore();
            dialogStore.hideDataSetCreateDialog();
        }
    }
}

</script>

<style lang="scss" scoped>

</style>