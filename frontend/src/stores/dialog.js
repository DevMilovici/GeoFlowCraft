import { defineStore } from "pinia";

export default defineStore('dialog', {
    state: () => ({
        dataSetCreateDialogVisible: false,
        dataSetDetailsDialogVisible: false
    }),
    actions: {
        // DataSetCreate
        showDataSetCreateDialog() {
            this.dataSetCreateDialogVisible = true;
        },
        hideDataSetCreateDialog() {
            this.dataSetCreateDialogVisible = false;
        },
        // DataSetDetails
        showDataSetDetailsDialog() {
            this.dataSetDetailsDialogVisible = true;
        },
        hideDataSetDetailsDialog() {
            this.dataSetDetailsDialogVisible = false;
        }
    }
})