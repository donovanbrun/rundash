import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createMemoryHistory, createRouter } from 'vue-router';
import Activity from './pages/Activity.vue';
import Home from './pages/Home.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/activity/:id', component: Activity },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

createApp(App)
    .use(router)
    .mount('#app')
