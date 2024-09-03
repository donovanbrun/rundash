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
import { Activity } from '../models/activity';

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

const formatNumber = (n: number) => n.toFixed(2);

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
                    <td>{{ formatNumber(averageHr) }} bpm</td>
                    <td>{{ formatNumber(maxHr) }} bpm</td>
                </tr>
            </tbody>
        </table>
        <!-- <Line :data="chartData" /> -->
    </div>
</template>

<style scoped>
/* Styles spécifiques au composant */
</style>