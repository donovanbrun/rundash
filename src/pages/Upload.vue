<script setup lang="ts">
import { readGpx } from '../utils/gpxReader';
import { Activity, ActivityType } from '../models/activity';
import * as activityService from '../services/ActivityService';
import { ref } from 'vue';

const handleFileChange = async (e: any) => {
    const files: FileList = e.target.files;

    if (files.length > 0) {
        let success = 0;
        let failed = 0;
        result.value = "Loading...";
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await readGpx(file)
                .then((d: Activity) => {
                    d.type = type.value;
                    activityService.saveActivity(d);
                    success++;
                })
                .catch((e) => {
                    console.error(e);
                    failed++;
                });
        }
        result.value = `Successfully uploaded ${success} files. ${failed} failed.`;
    } else {
        alert('Veuillez sélectionner un fichier XML.');
    }
}

const type = ref<ActivityType>(ActivityType.RUNNING);
const result = ref<String>("");
</script>

<template>
    <div class="page">
        <div class="list">
            <div class="component">
                <h2>Upload a new activity</h2>
                <label for="type">Type:</label>
                <select v-model="type">
                    <option v-for="type in ActivityType" :value="type">{{ type }}</option>
                </select>
                <label for="xmlFile">Select a GPX file:</label>
                <input type="file" id="xmlFile" accept=".xml,.gpx" @change="handleFileChange" multiple="true">
                <p v-if="result.length > 0">{{ result }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>