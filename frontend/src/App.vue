<template>
  <div class="w-full">
    <!-- Page header -->
    <header class="min-w-[200px] flex flex-row gap-2 p-2 shadow-lg shadow-green-500/50">
      <!-- Logo -->
      <div class="flex flex-row items-center justify-center gap-2">
        <!-- Image -->
        <img alt="GeoFlowCraft logo" class="logo" src="@/assets/planet_icon_512x512.png" width="50" height="50" />
        <!-- Title -->
        <RouterLink to="/"><span class="font-bold text-2xl text-teal-400">GeoFlowCraft</span></RouterLink>
      </div>
      <!-- Nav links -->
      <!-- <div class="h-full">
        <nav class="flex flex-row items-center justify-center">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div> -->
    </header>

    <!-- Page content -->
    <RouterView class="w-full" />
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'


export default {
  name: "App",
  components: {
    RouterLink, RouterView
  },
  computed: {},
  methods: {}
}

</script>

<style lang="scss">
@import url("../node_modules/ol/ol.css");

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a:first-of-type {
  border: 0;
}

</style>