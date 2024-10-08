import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createRouter, createWebHistory } from 'vue-router';
import Activity from './pages/Activity.vue';
import Home from './pages/Home.vue';
import Upload from './pages/Upload.vue';
import Activities from './pages/Activities.vue';
import Settings from './pages/Settings.vue';
import Strava from './pages/Strava.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/activities', component: Activities },
    { path: '/activity/:id', component: Activity },
    { path: '/upload', component: Upload },
    { path: '/settings', component: Settings },
    { path: '/strava', component: Strava }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App)
    .use(router)
    .mount('#app')
