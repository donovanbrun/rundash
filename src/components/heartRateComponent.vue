<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
// import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
} from 'chart.js';
import * as functions from '../utils/functions';
import * as format from '../utils/format';
import { Activity } from '../models/activity';
import * as settingService from '../services/SettingService';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

const props = defineProps({
    activity: {
        type: Activity,
        required: true,
    }
});

// Données réactives pour le graphique
const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Heart rate',
            data: [],
            borderColor: 'rgb(255, 0, 0)',
            tension: 0.1,
        },
    ],
});

function updateChartData(newData: any) {
    chartData.value.labels = newData.map((d: any) => d.id);
    chartData.value.datasets[0].data = newData.map((d: any) => d.hr);
}

watchEffect(() => {
    updateChartData(props.activity.segments);
});

const averageHr = computed(() => functions.averageHr(props.activity.segments));

const maxHr = computed(() => functions.maxHr(props.activity.segments));

const zones = computed(() => {
    const settings = settingService.getSettings();
    return functions.hrZones(props.activity.segments, settings?.max_heart_rate ?? 200);
});

</script>

<template>
    <div class="component">
        <h2>Heart rate</h2>
        <table>
            <thead>
                <tr>
                    <th>Average</th>
                    <th>Maximum</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ format.formatNumber(averageHr, 0) }} bpm</td>
                    <td>{{ format.formatNumber(maxHr, 0) }} bpm</td>
                </tr>
            </tbody>
        </table>
        <!-- <Line :data="chartData" /> -->
        <table>
            <thead>
                <tr>
                    <th>Zone</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(zone, index) in zones" :key="index">
                    <td>Zone {{ index + 1 }}</td>
                    <td>{{ format.formatNumber(zone, 0) }}%</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped></style>