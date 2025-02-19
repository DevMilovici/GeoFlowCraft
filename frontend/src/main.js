import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { Form } from "@primevue/forms";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from 'primevue/textarea';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ListBox from "primevue/listbox";
import Tooltip from 'primevue/tooltip';
import Dialog from 'primevue/dialog';

import 'primeicons/primeicons.css'

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(ToastService);

app.component("PrimeForm", Form);
app.component("PrimeButton", Button);
app.component("PrimeInputText", InputText);
app.component("PrimeTextarea", Textarea);
app.component("PrimeMessage", Message);
app.component("PrimeToast", Toast);
app.component("PrimeListBox", ListBox);
app.component("PrimeDialog", Dialog);
app.directive("tooltip", Tooltip);

app.use(createPinia());
app.use(router);

app.mount('#app');