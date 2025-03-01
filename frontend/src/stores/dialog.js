import { defineStore } from "pinia";

export default defineStore('dialog', {
    state: () => ({
        dataSetCreateDialogVisible: false,
        dataSetDetailsDialogVisible: false,
        dataLayerCreateDialogVisible: false
    }),
    actions: {
        // DataSetCreateDialog
        showDataSetCreateDialog() {
            this.dataSetCreateDialogVisible = true;
        },
        hideDataSetCreateDialog() {
            this.dataSetCreateDialogVisible = false;
        },
        // DataSetDetailsDialog
        showDataSetDetailsDialog() {
            this.dataSetDetailsDialogVisible = true;
        },
        hideDataSetDetailsDialog() {
            this.dataSetDetailsDialogVisible = false;
        },
        // DataLayerCreateDialog
        showDataLayerCreateCatalog() {
            this.dataLayerCreateDialogVisible = true;
        },
        hideDataLayerCreateCatalog() {
            this.dataLayerCreateDialogVisible = false;
        }
    }
})