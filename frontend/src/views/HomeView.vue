<template>

  <div id="map" class="relative h-full">
    <div class="absolute z-[100] right-1 top-1 p-1 bg-gray-800 w-[250px] border-2 border-gray-300 rounded-md">
      <AppDataSetList/>
      <!-- Dialogs -->
      <AppDataSetCreateDialog @created-data-set="onDataSetCreated" />
      <AppDataSetDetailsDialog />
      <AppDataLayerCreateDialog @created-data-layer="onDataLayerCreated"/>
      <PrimeToast />
    </div>
  </div>

</template>

<script>
import Map from "ol/Map.js";
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

import AppDataSetList from "../components/AppDataSetList.vue";
import AppDataSetCreateDialog from "../components/dialogs/AppDataSetCreateDialog.vue";
import AppDataSetDetailsDialog from "@/components/dialogs/AppDataSetDetailsDialog.vue";
import AppDataLayerCreateDialog from "@/components/dialogs/AppDataLayerCreateDialog.vue";

export default {
  name: "HomeView",
  components: { 
    AppDataSetList, AppDataSetCreateDialog, AppDataSetDetailsDialog,
    AppDataLayerCreateDialog
  },
  data() {
    return {}
  },
  mounted() {
    // Taken from:  https://openlayers.org/doc/quickstart.html
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
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