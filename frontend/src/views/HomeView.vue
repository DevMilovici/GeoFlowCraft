<template>

  <div id="map" class="relative h-full">
    <div class="absolute z-[100] right-1 top-1 p-1 bg-gray-800 w-[250px] border-2 border-gray-300 rounded-md flex flex-col gap-1">
      <!-- List of datasets -->
      <AppDataSetList class="border-b-2 border-gray-300" />
      <!-- List of visible datalayers -->
      <AppDataLayerList />
    </div>
    <!-- Dialogs -->
    <AppConfirmDialog @confirm-yes="onConfirmYes" @confirm-no="onConfirmNo" />
    <AppDataSetCreateDialog @created-data-set="onDataSetCreated" />
    <AppDataSetDetailsDialog />
    <AppDataLayersDialog />
    <AppDataLayerCreateDialog @created-data-layer="onDataLayerCreated"/>
    <PrimeToast />
  </div>

</template>

<script>

import useMapStore from "@/stores/map";
import useDialogStore from "@/stores/dialog";
import useDataSetStore from "@/stores/dataSet";
import useDataLayerStore from "@/stores/dataLayer";

import AppConfirmDialog from "@/components/dialogs/AppConfirmDialog.vue";
import AppDataSetList from "../components/AppDataSetList.vue";
import AppDataSetCreateDialog from "../components/dialogs/AppDataSetCreateDialog.vue";
import AppDataSetDetailsDialog from "@/components/dialogs/AppDataSetDetailsDialog.vue";
import AppDataLayersDialog from "@/components/dialogs/AppDataLayersDialog.vue";
import AppDataLayerList from "@/components/AppDataLayerList.vue";
import AppDataLayerCreateDialog from "@/components/dialogs/AppDataLayerCreateDialog.vue";

export default {
  name: "HomeView",
  components: { 
    AppConfirmDialog,
    AppDataSetList,
    AppDataSetCreateDialog, AppDataSetDetailsDialog,
    AppDataLayerList,
    AppDataLayersDialog, AppDataLayerCreateDialog
  },
  data() {
    return {}
  },
  mounted() {
    const mapStore = useMapStore();
    mapStore.initialize();
  },
  computed: {},
  methods: {
    onDataSetCreated() {
      this.$toast.add({ severity: "success", summary: "Success", detail: "The dataset has been successfully created!", life: 3000 });
    },
    onDataLayerCreated() {
      this.$toast.add({ severity: "success", summary: "Success", detail: "The datalayer has been successfully created!", life: 3000 });
    },
    async onConfirmYes() {
      const dialogStore = useDialogStore();
      try {        
        dialogStore.confirmDialogIsLoading = true;
        
        const event = dialogStore.confirmDialogInfo.event;
        switch (event) {
          case "DELETE_SELECTED_DATASET": // TODO: Create an enum of events
            const dataSetStore = useDataSetStore();
            const deleteResult = await dataSetStore.deleteDataSet();

            if(deleteResult?.success) {
              this.$toast.add({ severity: "success", summary: "Success", detail: "The dataset has been successfully deleted!", life: 3000 });
              dialogStore.hideDataSetDetailsDialog();
            } else {
              this.$toast.add({ severity: "error", summary: "Error", detail: deleteResult.message ?? "Something went wrong!" , life: 3000 });
            }
            break;
          case "DELETE_SELECTED_DATALAYER": // TODO: Create an enum of events
            const dataLayerStore = useDataLayerStore();  
            const mapStore = useMapStore();
            await mapStore.hideLayer(dataLayerStore.selectedDataLayer.id);
            const response = await dataLayerStore.deleteDataLayer(dataLayerStore.selectedDataLayer.id);
            if(response?.success) {
                this.$toast.add({ severity: "success", summary: "Success", detail: "The datalayer has been successfully deleted!", life: 3000 });
            } else {
                this.$toast.add({ severity: "error", summary: "Failed deleting datalayer!", detail: `Something went wrong on the backend side: ${response.error}`, life: 3000 });
            }
            break;
          default:
            console.error("Unknown event!")
            break;
        }
      } catch (error) {
        console.log(error);
        this.$toast.add({ severity: "error", summary: "Error", detail: error.message ?? "Something went wrong!" , life: 3000 });
      } finally {
        dialogStore.confirmDialogIsLoading = false;
      }
      dialogStore.hideConfirmDialog();
    },
    onConfirmNo() {
      const dialogStore = useDialogStore();
      dialogStore.hideConfirmDialog();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>