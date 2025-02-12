<template>
  <div class="w-full">
    <!-- Navbar -->
    <AppNavBar/>
    <!-- Page content -->
    <RouterView class="w-full" />
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import AppNavBar from "@/components/AppNavBar.vue";


export default {
  name: "App",
  components: {
    RouterLink, RouterView,
    AppNavBar
  },
  computed: {},
  methods: {}
}

</script>

<style lang="scss">
@import url("../node_modules/ol/ol.css");

</style>