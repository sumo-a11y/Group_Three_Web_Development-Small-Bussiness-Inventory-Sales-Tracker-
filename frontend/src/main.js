import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AOS from "aos";
import "aos/dist/aos.css";
import App from './App.vue'
import router from './router'
import VueApexCharts from "vue3-apexcharts";
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

AOS.init();
const app = createApp(App)


app.use(ToastPlugin);
app.use(createPinia())

app.use(VueApexCharts)
app.use(router)

app.mount('#app')
