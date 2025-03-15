<template>

  <div id="map" class="relative h-full">
    <div class="absolute z-[100] right-1 top-1 p-1 bg-gray-800 w-[250px] border-2 border-gray-300 rounded-md flex flex-col gap-1">
      <!-- List of datasets -->
      <AppDataSetList class="border-b-2 border-gray-300" />
      <!-- List of visible datalayers -->
      <AppDataLayerList />
    </div>
    <!-- Dialogs -->
    <AppDataSetCreateDialog @created-data-set="onDataSetCreated" />
    <AppDataSetDetailsDialog />
    <AppDataLayerCreateDialog @created-data-layer="onDataLayerCreated"/>
    <PrimeToast />
  </div>

</template>

<script>

import useMapStore from "@/stores/map";

import AppDataSetList from "../components/AppDataSetList.vue";
import AppDataSetCreateDialog from "../components/dialogs/AppDataSetCreateDialog.vue";
import AppDataSetDetailsDialog from "@/components/dialogs/AppDataSetDetailsDialog.vue";
import AppDataLayerList from "@/components/AppDataLayerList.vue";
import AppDataLayerCreateDialog from "@/components/dialogs/AppDataLayerCreateDialog.vue";

export default {
  name: "HomeView",
  components: { 
    AppDataSetList,
    AppDataSetCreateDialog, AppDataSetDetailsDialog,
    AppDataLayerList,
    AppDataLayerCreateDialog
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>