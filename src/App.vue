<script setup lang="ts">
</script>

<template>
    <div class="home">
        <nav>
            <router-link to="/" class="nav-link">Home</router-link>
        </nav>
        <router-view></router-view>
    </div>
</template>

<style>
.home {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px 0px;
    flex-direction: column;
    gap: 20px;
    background-color: #101010;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 10px;
    border-radius: 5px;
    background-color: #303030;
}
</style>
