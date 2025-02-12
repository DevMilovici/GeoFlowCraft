<template>

  <div id="map" class="relative h-full">
    <div class="absolute z-[100] right-1 top-1 p-1 bg-gray-800 w-[250px] border-2 border-gray-300 rounded-md">
      <!-- DataSets list -->
      <div class="flex flex-col items-center justify-center p-1">
        <div class="flex flex-row gap-2 items-center justify-between p-2">
          <div class="flex flex-row gap-2">
            <i class="pi pi-database" style="font-size: 1.5rem;"></i>
            <span class="w-full text-center">
              Datasets
            </span>
          </div>
          <PrimeButton rounded type="button" icon="pi pi-plus" severity="success" size="small" />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <PrimeListBox v-model="selectedDataset" :options="datasets" optionLabel="name" fluid class="w-full">
            <template #option="slotProps">
              <div class="flex items-center">
                <div>{{ slotProps.option.name }}</div>

              </div>
            </template>
          </PrimeListBox>
        </div>
      </div>
      <!-- DataSets controls -->
      <div class="w-full flex gap-1 items-center justify-center">
        <PrimeButton :disabled="selectedDataset === null" type="button" label="Details" icon="pi pi-eye" severity="info" size="small" class="text-xs"/>
      </div>
    </div>
  </div>

</template>

<script>
import Map from "ol/Map.js";
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      selectedDataset: null,
      datasets: [
        {
          name: "DataSet_0",
          description: "This is DataSet_0...",
          layers: []
        },
        {
          name: "DataSet_1",
          description: "This is DataSet_0...",
          layers: []
        },
        {
          name: "DataSet_2",
          description: "This is DataSet_0...",
          layers: []
        },
        {
          name: "DataSet_3",
          description: "This is DataSet_0...",
          layers: []
        },
        {
          name: "DataSet_4",
          description: "This is DataSet_0...",
          layers: []
        },
        {
          name: "DataSet_5",
          description: "This is DataSet_0...",
          layers: []
        },
        {
          name: "DataSet_6",
          description: "This is DataSet_0...",
          layers: []
        },
        {
          name: "DataSet_7",
          description: "This is DataSet_0...",
          layers: []
        },
        {
          name: "DataSet_8",
          description: "This is DataSet_0...",
          layers: []
        }
      ]
    }
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
  methods: {}
}
</script>

<style lang="scss">

.p-listbox-list,	.p-listbox-option {
  border: 1px solid rgb(79, 79, 79) !important;
  background-color: rgb(31 41 55);
}

</style>