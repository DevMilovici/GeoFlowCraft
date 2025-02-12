<template>
  <div id="map" class="h-full">
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

</style>