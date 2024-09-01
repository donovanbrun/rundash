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
import { Segment } from '../models/segment';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

const props = defineProps({
    data: {
        type: Array,
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
    updateChartData(props.data);
});

const averageHr = computed(() => functions.averageHr(props.data as Segment[]));

const maxHr = computed(() => functions.maxHr(props.data as Segment[]));

</script>

<template>
    <div class="Component">
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
                    <td>{{ averageHr }} bpm</td>
                    <td>{{ maxHr }} bpm</td>
                </tr>
            </tbody>
        </table>
        <!-- <Line :data="chartData" /> -->
    </div>
</template>

<style scoped>
/* Styles spécifiques au composant */
</style>