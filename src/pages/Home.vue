<script setup lang="ts">
import { Activity } from '../models/activity';
import * as activityService from '../services/ActivityService';
import { ref, computed } from 'vue';
import * as functions from '../utils/functions';

const fetchActivities = () => {
    activities.value = activityService.getActivities().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const activities = ref<Activity[]>([]);
fetchActivities();

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
    <div class="page">
        <div class="list">
            <div class="component">
                <h2>This week</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Distance</td>
                            <td>
                                {{ functions.formatNumber(activitiesLastWeek.reduce((acc, a) => acc + a.distance, 0)) }}
                                km
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
                                {{ functions.formatNumber(activitiesLastMonth.reduce((acc, a) => acc + a.distance, 0))
                                }} km
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
                                {{ functions.formatNumber(activitiesLastYear.reduce((acc, a) => acc + a.distance, 0)) }}
                                km
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
    </div>
</template>

<style scoped></style>