<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue';
import { readGpx } from './utils/gpxReader';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Segment } from './models/segment';
import heartRateComponent from './components/heartRateComponent.vue';
import * as functions from './utils/functions';

const data: Ref<Segment[]> = ref([]);
const segmentsByKm: Ref<Segment[][]> = ref([]);
const step = 1;

const map: Ref<L.Map | undefined> = ref();
const mapLayer: Ref<L.LayerGroup | undefined> = ref();

onMounted(() => {
    map.value = L.map('map').setView([48.858370, 2.29448], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map.value);

    mapLayer.value = L.layerGroup().addTo(map.value);
});

const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    data.value = [];

    if (file) {
        readGpx(file)
            .then((d: Segment[]) => {
                data.value = d;
                mapLayer.value?.clearLayers();
                segmentsByKm.value = functions.groupByKm(data.value, step);
                const averageSpeed = functions.averageSpeed(data.value);
                segmentsByKm.value.forEach((segments, i, segmentsGroup) => {
                    if (i == 0) {
                        map.value?.setView([segments[0].lat, segments[0].lon], 15)
                    }
                    const latLngs: any = segments.map(d => [d.lat, d.lon]);
                    const avg = functions.averageSpeed(segments);
                    if (mapLayer.value) {
                        let color = "green";
                        if (avg / averageSpeed > 1.05) {
                            color = "red";
                        }
                        else if (avg / averageSpeed < 0.95) {
                            color = "blue"
                        }
                        /*const polyline = */L.polyline(latLngs, { color }).addTo(mapLayer.value);
                        //map.value?.fitBounds(polyline.getBounds());

                        if (i < segmentsGroup.length - 1) {
                            const last = segments[segments.length - 1];
                            const first = segmentsGroup[i + 1][0];
                            L.polyline([[last.lat, last.lon], [first.lat, first.lon]], { color }).addTo(mapLayer.value);
                        }
                    }
                });
            })
            .catch((e) => {
                console.error(e);
                alert('Failed to read the file.');
            });
    } else {
        alert('Veuillez sélectionner un fichier XML.');
    }
}

const formatNumber = (n: number) => n.toFixed(2);

const distance = computed(() => functions.distance(data.value));

const averageSpeed = computed(() => functions.averageSpeed(data.value));

const maxSpeed = computed(() => functions.maxSpeed(data.value));

const speedToMinKm = computed(() => functions.speedToMinKm(data.value));

const deltaTime = computed(() => functions.deltaTime(data.value));

const evelationGain = computed(() => functions.evelationGain(data.value));

const maxElevation = computed(() => functions.maxElevation(data.value));

const minElevation = computed(() => functions.minElevation(data.value));

</script>

<template>
    <div class="home">
        <h1>RunDash</h1>
        <div class="Component">
            <label for="xmlFile">Select a GPX file:</label>
            <input type="file" id="xmlFile" accept=".xml,.gpx" @change="handleFileChange">
        </div>

        <div class="list">
            <div class="Component wide">
                <h2>Map</h2>
                <div id="map"></div>
            </div>

            <div class="Component">
                <h2>General Info</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Distance</td>
                            <td>{{ formatNumber(distance) }} km</td>
                        </tr>
                        <tr>
                            <td>Total time</td>
                            <td>{{ deltaTime }}</td>
                        </tr>
                        <tr>
                            <td>Average pace</td>
                            <td>{{ speedToMinKm }}/km</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <heartRateComponent :data="data"></heartRateComponent>


            <div class="Component">
                <h2>Statistics</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Average speed</td>
                            <td>{{ formatNumber(averageSpeed) }} km/h</td>
                        </tr>
                        <tr>
                            <td>Maximum speed</td>
                            <td>{{ formatNumber(maxSpeed) }} km/h</td>
                        </tr>
                        <tr>
                            <td>Elevation gain</td>
                            <td>{{ formatNumber(evelationGain) }} m</td>
                        </tr>
                        <tr>
                            <td>Minimum elevation</td>
                            <td>{{ formatNumber(minElevation) }} m</td>
                        </tr>
                        <tr>
                            <td>Maximum elevation</td>
                            <td>{{ formatNumber(maxElevation) }} m</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="Component">
                <h2>Segments</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Distance</th>
                            <th>Average pace</th>
                            <th>Average Hr</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(segments, i) in segmentsByKm">
                            <td>{{ formatNumber(i * step) }}</td>
                            <td>{{ functions.speedToMinKm(segments) }}</td>
                            <td>{{ functions.averageHr(segments) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- <div class="Component">
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
                        <tr v-for="(d, index) in data" :key="index">
                            <td>{{ d.id }}</td>
                            <td>{{ d.time }}</td>
                            <td>{{ d.lat }}</td>
                            <td>{{ d.lon }}</td>
                            <td>{{ d.ele }}</td>
                            <td>{{ d.hr }}</td>
                        </tr>
                    </tbody>
                </table>
            </div> -->
        </div>
    </div>
</template>

<style>
.home {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    flex-direction: column;
    gap: 20px;
    background-color: #101010;
}

h1 {
    color: white;
    font-size: 4rem;
    width: 100%;
    text-align: center;
}

#map {
    width: 100%;
    height: 460px;
    border-radius: 10px;
}

table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
}

td,
th {
    border: 1px solid rgb(50, 50, 50);
    padding: 8px;
    text-align: left;
}

.list {
    display: flex;
    justify-content: center;
    align-items: start;
    gap: 20px;
    flex-wrap: wrap;
}

.Component {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    width: 500px;
    max-width: 90vw;
    padding: 20px;
    background-color: #272727;
    border-radius: 15px;

    >* {
        color: white;
    }

    >h2 {
        font-size: 2rem;
    }
}

.wide {
    width: 1000px;
    max-width: 90vw;
}
</style>
