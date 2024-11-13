import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Button from "primevue/button";

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.component("Button", Button);

app.use(createPinia());
app.use(router);

app.mount('#app');