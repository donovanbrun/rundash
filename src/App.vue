<script setup lang="ts">
import Nav from './components/Nav.vue';
</script>

<template>
    <div class="app">
        <Nav></Nav>
        <router-view></router-view>
    </div>
</template>

<style scoped>
.app {
    display: flex;
    height: 100vh;
    background-color: #101010;
}

@media (max-width: 768px) {
    .app {
        flex-direction: column;
    }
}
</style>
