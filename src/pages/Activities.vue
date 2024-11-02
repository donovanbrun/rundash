<script setup lang="ts">
import { Activity, ActivityType } from '../models/activity';
import * as activityService from '../services/ActivityService';
import { ref, onMounted } from 'vue';
import * as format from '../utils/format';

const activities = ref<Activity[]>([]);

const fetchActivities = async () => {
    const acts = await activityService.getActivities();
    activities.value = acts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const deleteActivity = (id: number) => {
    activityService.deleteActivity(id);
    fetchActivities();
}

onMounted(async () => {
    await fetchActivities();
});

const updateActivityType = (activity: Activity, type: ActivityType) => {
    activity.type = type;
    activityService.saveActivity(activity);
}
</script>

<template>
    <div class="page">
        <div class="list">
            <div class="component">
                <h2>Activities</h2>
                <ul>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Distance</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="activity in activities" :key="activity.id">
                                <td>
                                    <router-link :to="'/activity/' + activity.id" class="activity">
                                        {{ activity.name }}
                                    </router-link>
                                </td>
                                <td>{{ new Date(activity.date).toUTCString() }}</td>
                                <td>
                                    <select v-model="activity.type"
                                        @change="updateActivityType(activity, activity.type)">
                                        <option v-for="type in ActivityType" :value="type">{{ type }}</option>
                                    </select>
                                </td>
                                <td>{{ format.formatNumber(activity.distance) }} km</td>
                                <td>{{ format.formatTime(activity.duration) }}</td>
                                <td>
                                    <button @click="deleteActivity(activity.id)">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.activity {
    margin: 0px;
    padding: 0px;
    color: white;
    text-decoration: underline;
}
</style>