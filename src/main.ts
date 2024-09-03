import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createMemoryHistory, createRouter } from 'vue-router';
import Activity from './pages/Activity.vue';
import Home from './pages/Home.vue';
import Upload from './pages/Upload.vue';
import Activities from './pages/Activities.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/activities', component: Activities },
    { path: '/activity/:id', component: Activity },
    { path: '/upload', component: Upload }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

createApp(App)
    .use(router)
    .mount('#app')
