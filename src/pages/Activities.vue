<script setup lang="ts">
import { Activity } from '../models/activity';
import * as activityService from '../services/ActivityService';
import { ref } from 'vue';
import * as functions from '../utils/functions';

const fetchActivities = () => {
    activities.value = activityService.getActivities().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const deleteActivity = (id: number) => {
    activityService.deleteActivity(id);
    fetchActivities();
}

const activities = ref<Activity[]>([]);
fetchActivities();
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
                                <td>{{ activity.type }}</td>
                                <td>{{ functions.formatNumber(activity.distance) }} km</td>
                                <td>{{ functions.formatTime(activity.duration) }}</td>
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