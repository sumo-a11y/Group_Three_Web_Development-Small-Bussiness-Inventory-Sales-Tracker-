import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AOS from "aos";
import "aos/dist/aos.css";

import App from './App.vue'
import router from './router'
import VueApexCharts from "vue3-apexcharts";
import { useAuthStore } from "@/stores/auth.store";

AOS.init();
const app = createApp(App)

app.use(createPinia())

const authStore = useAuthStore();
authStore.installInterceptors()
app.use(VueApexCharts)
app.use(router)

app.mount('#app')
