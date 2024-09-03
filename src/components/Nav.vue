<script setup lang="ts">

</script>

<template>
    <nav>
        <h1>RunDash</h1>
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/activities" class="nav-link">Activities</router-link>
        <router-link to="/upload" class="nav-link">Upload activities</router-link>
    </nav>
</template>

<style scoped>
nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100vh;
    min-width: 200px;
    background-color: var(--primary);
    padding: 10px;
}

@media (max-width: 768px) {
    nav {
        flex-direction: column;
        height: fit-content;
        width: 100vw;
        min-width: 0;
    }
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 10px;
    border-radius: 5px;
    background-color: #303030;
    height: fit-content;
    width: 100%;
}
</style>