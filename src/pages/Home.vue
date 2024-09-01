<script setup lang="ts">
import { readGpx } from '../utils/gpxReader';
import { Activity, ActivityType } from '../models/activity';
import * as activityService from '../services/ActivityService';
import { ref, computed } from 'vue';
import * as functions from '../utils/functions';

const handleFileChange = (e: any) => {
    const file = e.target.files[0];

    if (file) {
        readGpx(file)
            .then((d: Activity) => {
                d.type = type.value;
                activityService.saveActivity(d);
                fetchActivities();
            })
            .catch((e) => {
                console.error(e);
                alert('Failed to read the file.');
            });
    } else {
        alert('Veuillez sélectionner un fichier XML.');
    }
}

const fetchActivities = () => {
    activities.value = activityService.getActivities().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const activities = ref<Activity[]>([]);
fetchActivities();

const type = ref<ActivityType>(ActivityType.RUN);

const activitiesLastWeek = computed(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return activities.value.filter(a => new Date(a.date) >= weekAgo);
});

const activitiesLastMonth = computed(() => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return activities.value.filter(a => new Date(a.date) >= monthAgo);
});

const activitiesLastYear = computed(() => {
    const now = new Date();
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    return activities.value.filter(a => new Date(a.date) >= yearAgo);
});
</script>

<template>
    <h1>RunDash</h1>
    <div class="list">
        <div class="Component">
            <h2>Upload a new activity</h2>
            <label for="type">Type:</label>
            <select v-model="type">
                <option v-for="type in ActivityType" :value="type">{{ type }}</option>
            </select>
            <label for="xmlFile">Select a GPX file:</label>
            <input type="file" id="xmlFile" accept=".xml,.gpx" @change="handleFileChange">
        </div>

        <div class="Component">
            <h2>Activities</h2>
            <ul>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Distance</th>
                            <th>Duration</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr v-for="activity in activities" :key="activity.id">

                            <td>
                                <router-link :to="'/activity/' + activity.id" class="activity">
                                    {{ activity.name }}
                                </router-link>
                            </td>
                            <td>{{ activity.date }}</td>
                            <td>{{ functions.formatNumber(activity.distance) }} km</td>
                            <td>{{ functions.formatTime(activity.duration) }}</td>

                        </tr>
                    </tbody>
                </table>
            </ul>
        </div>

        <div class="Component">
            <h2>This week</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Distance</td>
                        <td>
                            {{ functions.formatNumber(activitiesLastWeek.reduce((acc, a) => acc + a.distance, 0)) }} km
                        </td>
                    </tr>
                    <tr>
                        <td>Duration</td>
                        <td>
                            {{ functions.formatTime(activitiesLastWeek.reduce((acc, a) => acc + a.duration, 0)) }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <h2>This month</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Distance</td>
                        <td>
                            {{ functions.formatNumber(activitiesLastMonth.reduce((acc, a) => acc + a.distance, 0)) }} km
                        </td>
                    </tr>
                    <tr>
                        <td>Duration</td>
                        <td>
                            {{ functions.formatTime(activitiesLastMonth.reduce((acc, a) => acc + a.duration, 0)) }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <h2>This year</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Distance</td>
                        <td>
                            {{ functions.formatNumber(activitiesLastYear.reduce((acc, a) => acc + a.distance, 0)) }} km
                        </td>
                    </tr>
                    <tr>
                        <td>Duration</td>
                        <td>
                            {{ functions.formatTime(activitiesLastYear.reduce((acc, a) => acc + a.duration, 0)) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.activity {
    margin: 0;
    padding: 0;
    color: white;
    text-decoration: underline;
}
</style>