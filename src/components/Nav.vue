<script setup lang="ts">

</script>

<template>
    <nav>
        <h1>RunDash</h1>
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/activities" class="nav-link">Activities</router-link>
        <router-link to="/upload" class="nav-link">Upload activities</router-link>
        <router-link to="/settings" class="nav-link">Settings</router-link>
        <a
            href="http://www.strava.com/oauth/authorize?client_id=123685&response_type=code&redirect_uri=http://localhost:5173/strava&approval_prompt=force&scope=activity:read_all">
            connect to strava
        </a>
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

a {
    color: white;
    text-decoration: none;
    padding: 10px;
    border-radius: 5px;
    background-color: #fc4c02;
    height: fit-content;
    width: 100%;
}
</style>