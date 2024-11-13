<template>
  <!-- Page header -->
  <header class="w-[200px] min-w-[200px] max-w-[200px] flex flex-col gap-4 p-2 shadow-lg shadow-green-500/50">
    <!-- Logo -->
    <div class="flex flex-col items-center justify-center">
      <!-- Title -->
      <span class="font-bold text-2xl text-teal-400">GeoFlowCraft</span>
      <!-- Image -->
      <img alt="Vue logo" class="logo" src="@/assets/planet_icon_512x512.png" width="125" height="125" />
    </div>
    <!-- Nav links -->
    <div class="h-full flex flex-col">
      <nav class="flex flex-col items-center justify-center">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <!-- Page content -->
  <RouterView class="w-full" />
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