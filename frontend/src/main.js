import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Button from "primevue/button";
import ListBox from "primevue/listbox";
import Tooltip from 'primevue/tooltip';

import 'primeicons/primeicons.css'

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.component("PrimeButton", Button);
app.component("PrimeListBox", ListBox);
app.directive("tooltip", Tooltip);

app.use(createPinia());
app.use(router);

app.mount('#app');