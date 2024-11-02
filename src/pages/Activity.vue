<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Segment } from '../models/segment';
import { Activity } from '../models/activity';
import heartRateComponent from '../components/heartRateComponent.vue';
import * as functions from '../utils/functions';
import * as format from '../utils/format';
import { useRoute } from 'vue-router';
import * as activityService from '../services/ActivityService';

const route = useRoute();

onMounted(() => {
    map.value = L.map('map').setView([48.858370, 2.29448], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map.value);

    mapLayer.value = L.layerGroup().addTo(map.value);

    fetchAll(Number.parseInt(route.params.id.toString()))
        .then(() => drawMap());
});

const fetchAll = async (id: number) => {
    activity.value = await activityService.getActivity(id);
    if (activity.value) {
        segmentsByKm.value = functions.groupByKm(activity.value.segments, step);
    }
}

const drawMap = () => {
    mapLayer.value?.clearLayers();
    const group = functions.groupByKm(activity.value?.segments ?? [], resolution.value);
    group.forEach((segments, i, segmentsGroup) => {
        if (i == 0) {
            map.value?.setView([segments[0].lat, segments[0].lon], 15)
        }
        const latLngs: any = segments.map(d => [d.lat, d.lon]);
        const avg = functions.averageSpeed(segments);
        if (mapLayer.value) {
            let color = "green";
            if (avg / (activity.value?.avgSpeed ?? 0) > 1.05) {
                color = "red";
            }
            else if (avg / (activity.value?.avgSpeed ?? 0) < 0.95) {
                color = "blue"
            }
            const p = L.polyline(latLngs, { color }).addTo(mapLayer.value);
            p.bindPopup(`
                Pace: ${format.speedToMinKm(avg)}/km
                <br>
                HR: ${format.formatNumber(functions.averageHr(segments), 0)} bpm
                <br>
                Gradient: ${format.formatNumber(Math.fround(functions.gradient(segments)), 0)}%
                `);


            if (i < segmentsGroup.length - 1) {
                const last = segments[segments.length - 1];
                const first = segmentsGroup[i + 1][0];
                L.polyline([[last.lat, last.lon], [first.lat, first.lon]], { color }).addTo(mapLayer.value);
            }
        }
    });
}

watch(
    () => route.params.id,
    (newId) => {
        fetchAll(Number.parseInt(newId.toString()))
            .then(() => drawMap());
    }
)

const activity = ref<Activity>();
const step = 1;
const segmentsByKm: Ref<Segment[][]> = ref([]);

const map: Ref<L.Map | undefined> = ref();
const mapLayer: Ref<L.LayerGroup | undefined> = ref();

const showData = ref(false);

const resolution = ref(0.1);

</script>

<template>
    <div class="page">
        <div class="list">
            <div class="component wide">
                <h2>Map</h2>
                <div id="map"></div>
                <p>Blue : slower than average speed; Green : equals average speed; Red : faster than average speed</p>

                <!-- <label for="select">Change resolution</label>
                <select v-model="resolution" @change="drawMap()">
                    <option value="0.1">100m</option>
                    <option value="0.5">500m</option>
                    <option value="1">1km</option>
                </select> -->
            </div>

            <div class="component" v-if="activity">
                <h2>General Info</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{{ activity.name }}</td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>{{ new Date(activity.date).toUTCString() }}</td>
                        </tr>
                        <tr>
                            <td>Type</td>
                            <td>{{ activity.type }}</td>
                        </tr>
                        <tr>
                            <td>Distance</td>
                            <td>{{ format.formatNumber(activity.distance) }} km</td>
                        </tr>
                        <tr>
                            <td>Total time</td>
                            <td>{{ format.formatTime(activity.duration) }}</td>
                        </tr>
                        <tr>
                            <td>Average pace</td>
                            <td>{{ format.speedToMinKm(activity.avgSpeed) }} / km</td>
                        </tr>
                        <tr>
                            <td>Gradient</td>
                            <td>{{ format.formatNumber(activity.elevationGain) }} m</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <heartRateComponent :activity="activity" v-if="activity"></heartRateComponent>

            <div class="component" v-if="activity">
                <h2>Statistics</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Average speed</td>
                            <td>{{ format.formatNumber(activity.avgSpeed) }} km/h</td>
                        </tr>
                        <tr>
                            <td>Maximum speed</td>
                            <td>{{ format.formatNumber(activity.maxSpeed) }} km/h</td>
                        </tr>
                        <tr>
                            <td>Elevation gain</td>
                            <td>{{ format.formatNumber(activity.elevationGain) }} m</td>
                        </tr>
                        <tr>
                            <td>Elevation loss</td>
                            <td>{{ format.formatNumber(activity.elevationLoss) }} m</td>
                        </tr>
                        <tr>
                            <td>Minimum elevation</td>
                            <td>{{ format.formatNumber(activity.minElevation) }} m</td>
                        </tr>
                        <tr>
                            <td>Maximum elevation</td>
                            <td>{{ format.formatNumber(activity.maxElevation) }} m</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="component" v-if="activity">
                <h2>Segments</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Distance</th>
                            <th>Average pace</th>
                            <th>Average Hr</th>
                            <th>Elevation (m)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(segments, i) in segmentsByKm">
                            <td>{{ format.formatNumber(i * step) }} km</td>
                            <td>{{ format.speedToMinKm(functions.averageSpeed(segments)) }}</td>
                            <td>{{ format.formatNumber(functions.averageHr(segments), 0) }}</td>
                            <td>{{ format.formatNumber(functions.sumElevation(segments), 0) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="component" v-if="activity && showData">
                <h2>Data</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Time</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Elevation</th>
                            <th>Heart Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(d, index) in activity.segments" :key="index">
                            <td>{{ d.id }}</td>
                            <td>{{ d.time }}</td>
                            <td>{{ d.lat }}</td>
                            <td>{{ d.lon }}</td>
                            <td>{{ d.ele }}</td>
                            <td>{{ d.hr }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
#map {
    width: 100%;
    height: 460px;
    border-radius: 10px;
}
</style>
