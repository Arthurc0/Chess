import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import '@/assets/style/main.css';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');
