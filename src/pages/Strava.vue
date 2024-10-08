<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { useRoute } from 'vue-router';
import * as stravaService from '../services/StravaService';
import * as stravaConverter from '../utils/stravaConverter';
import * as activityService from '../services/ActivityService';
import { Activity } from '../models/activity';

const route = useRoute();
const activites: Ref<Activity[]> = ref([]);
const nbActivities = ref(0);
const success = ref(0);
const error = ref(0);
const done = ref(true);

onMounted(async () => {
    done.value = false;
    const token = await stravaService.getAccessToken(route.query.code as string);

    if (route.query.code) {
        const a = await stravaService.getActivities(token);
        activites.value = a.data;
        nbActivities.value = a.data.length;
    }

    for (const a of activites.value) {
        try {
            const act = await stravaService.getActivity(token, a.id);
            const activity = await stravaConverter.convertStravaToActivity(act);
            activityService.saveActivity(activity);
            success.value++;
        }
        catch (e) {
            error.value++;
            console.error(e);
        }
    }

    await stravaService.disconnect(token);
    done.value = true;
});
</script>

<template>
    <div class="page">
        <h1>Connect with Strava</h1>
        <div class="component">
            <p>Loaded : {{ nbActivities }} activities</p>
            <p>Success : {{ success }}</p>
            <p>Error : {{ error }}</p>
            <p v-if="!done">Wait...</p>
            <p v-else>Done</p>
        </div>
    </div>
</template>

<style scoped></style>