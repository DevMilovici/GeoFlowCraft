import { defineStore } from "pinia";

export default defineStore('dialog', {
    state: () => ({
        dataSetCreateDialogVisible: false,
        dataSetDetailsDialogVisible: false,
        dataLayersDialogVisible: false,
        dataLayerCreateDialogVisible: false,
        modelProcessingRequestDialog: {
            visible: false,
            isLoading: false,
            requestInfo: {
                selectedModel: null,
                selectedDates: null,
                geoJson: null
            }
        },
        confirmDialogVisible: false,
        confirmDialogInfo: null,
        confirmDialogIsLoading: false
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
        // DataLayersDialog
        showDataLayersDialog() {
            this.dataLayersDialogVisible = true;
        },
        hideDataLayersDialog() {
            this.dataLayersDialogVisible = false;
        },
        // DataLayerCreateDialog
        showDataLayerCreateCatalog() {
            this.dataLayerCreateDialogVisible = true;
        },
        hideDataLayerCreateCatalog() {
            this.dataLayerCreateDialogVisible = false;
        },
        // ModelProcessingRequestDialog
        showModelProcessingRequestDialog(requestInfo) {
            if(!(requestInfo?.geoJson)) {
                throw "Missing 'geoJSON' for creating the model processing request!"
            }

            this.modelProcessingRequestDialog.requestInfo.geoJson = requestInfo.geoJson;
            this.modelProcessingRequestDialog.visible = true;
        },
        hideModelProcessingRequestDialog() {
            this.modelProcessingRequestDialog.visible = false;
        },
        // ConfirmDialog
        showConfirmDialog(confirmInfo) {
            this.confirmDialogInfo = confirmInfo;
            this.confirmDialogVisible = true;
        },
        hideConfirmDialog() {
            this.confirmDialogVisible = false;
            this.confirmDialogInfo = null;
        },
    }
})