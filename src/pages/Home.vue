<script setup lang="ts">
import { Activity } from '../models/activity';
import * as activityService from '../services/ActivityService';
import { ref, computed } from 'vue';
import * as format from '../utils/format';

const fetchActivities = async () => {
    activities.value = (await activityService.getActivities()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
                <h2>Overall Statistics</h2>
                <table>
                    <thead>
                        <tr>
                            <th rowspan="6"></th>
                        </tr>
                        <tr>
                            <th colspan="2">Running</th>
                            <th colspan="2">Cycling</th>
                            <th colspan="2">Swimming</th>
                        </tr>
                        <tr>
                            <th scope="col">Distance</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Distance</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Distance</th>
                            <th scope="col">Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>This week</th>
                            <td>
                                {{ format.formatNumber(activitiesLastWeek.filter(a => a.type.toString() ===
                                    'Running').reduce((acc, a) => acc + a.distance, 0)) }}
                                km
                            </td>
                            <td>
                                {{ format.formatTime(activitiesLastWeek.filter(a => a.type.toString() ===
                                    'Running').reduce((acc, a) => acc + a.duration, 0)) }}
                            </td>
                            <td>
                                {{ format.formatNumber(activitiesLastWeek.filter(a => a.type.toString() ===
                                    'Cycling').reduce((acc, a) => acc + a.distance, 0)) }}
                                km
                            </td>
                            <td>
                                {{ format.formatTime(activitiesLastWeek.filter(a => a.type.toString() ===
                                    'Cycling').reduce((acc, a) => acc + a.duration, 0)) }}
                            </td>
                            <td>
                                {{ format.formatNumber(activitiesLastWeek.filter(a => a.type.toString() ===
                                    'Swimming').reduce((acc, a) => acc + a.distance, 0)) }}
                                km
                            </td>
                            <td>
                                {{ format.formatTime(activitiesLastWeek.filter(a => a.type.toString() ===
                                    'Swimming').reduce((acc, a) => acc + a.duration, 0)) }}
                            </td>
                        </tr>
                        <tr>
                            <th>This month</th>
                            <td>
                                {{ format.formatNumber(activitiesLastMonth.filter(a => a.type.toString() ===
                                    'Running').reduce((acc, a) => acc + a.distance, 0)) }}
                                km
                            </td>
                            <td>
                                {{ format.formatTime(activitiesLastMonth.filter(a => a.type.toString() ===
                                    'Running').reduce((acc, a) => acc + a.duration, 0)) }}
                            </td>
                            <td>
                                {{ format.formatNumber(activitiesLastMonth.filter(a => a.type.toString() ===
                                    'Cycling').reduce((acc, a) => acc + a.distance, 0)) }}
                                km
                            </td>
                            <td>
                                {{ format.formatTime(activitiesLastMonth.filter(a => a.type.toString() ===
                                    'Cycling').reduce((acc, a) => acc + a.duration, 0)) }}
                            </td>
                            <td>
                                {{ format.formatNumber(activitiesLastMonth.filter(a => a.type.toString() ===
                                    'Swimming').reduce((acc, a) => acc + a.distance, 0)) }}
                                km
                            </td>
                            <td>
                                {{ format.formatTime(activitiesLastMonth.filter(a => a.type.toString() ===
                                    'Swimming').reduce((acc, a) => acc + a.duration, 0)) }}
                            </td>
                        </tr>
                        <tr>
                            <th>This year</th>
                            <td>
                                {{ format.formatNumber(activitiesLastYear.filter(a => a.type.toString() ===
                                    'Running').reduce((acc, a) => acc + a.distance, 0)) }}
                                km
                            </td>
                            <td>
                                {{ format.formatTime(activitiesLastYear.filter(a => a.type.toString() ===
                                    'Running').reduce((acc, a) => acc + a.duration, 0)) }}
                            </td>
                            <td>
                                {{ format.formatNumber(activitiesLastYear.filter(a => a.type.toString() ===
                                    'Cycling').reduce((acc, a) => acc + a.distance, 0)) }}
                                km
                            </td>
                            <td>
                                {{ format.formatTime(activitiesLastYear.filter(a => a.type.toString() ===
                                    'Cycling').reduce((acc, a) => acc + a.duration, 0)) }}
                            </td>
                            <td>
                                {{ format.formatNumber(activitiesLastYear.filter(a => a.type.toString() ===
                                    'Swimming').reduce((acc, a) => acc + a.distance, 0)) }}
                                km
                            </td>
                            <td>
                                {{ format.formatTime(activitiesLastYear.filter(a => a.type.toString() ===
                                    'Swimming').reduce((acc, a) => acc + a.duration, 0)) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped></style>