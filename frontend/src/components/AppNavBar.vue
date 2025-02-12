<template>
    <div class="bg-gray-800">
        <nav class="min-w-[200px] flex flex-row items-center gap-2 p-2 shadow-lg shadow-green-500/50">
            <!-- Logo -->
            <div class="flex flex-row items-center justify-center gap-2">
                <!-- Image -->
                <img alt="GeoFlowCraft logo" class="logo" src="@/assets/planet_icon_512x512.png" width="50"
                    height="50" />
                <!-- Title -->
                <RouterLink to="/"><span class="font-bold text-2xl text-teal-400">GeoFlowCraft</span></RouterLink>
            </div>
            <!-- Nav links -->
            <div class="h-full border border-gray-700">
                <nav class="flex flex-row items-center justify-center">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
                </nav>
            </div>
        </nav>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
    name: "AppNavBar",
    components: {
        RouterLink
    },
    computed: {},
    methods: {}
}

</script>

<style lang="scss">
nav a.router-link-exact-active {
  color: rgb(20 184 166);;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a:first-of-type {
  border: 0;
}
</style>