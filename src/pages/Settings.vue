<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as settingService from '../services/SettingService';
import * as activityService from '../services/ActivityService';

const settings = ref({
    max_heart_rate: "200",
    height: "180",
    weight: "70"
});

onMounted(() => {
    let st = settingService.getSettings();
    if (!st) {
        st = settings.value;
        settingService.saveSettings(settings.value);
    }
    settings.value = st;
})

const updateSetting = (fieldName: string, value: string) => {
    // @ts-ignore
    settings.value[fieldName] = value;
    settingService.saveSettings(settings.value);
}

const deleteAllData = () => {
    localStorage.clear();
    activityService.clearActivities();
}

const resetSettings = () => {
    settings.value = {
        max_heart_rate: "200",
        height: "180",
        weight: "70"
    };
    settingService.saveSettings(settings.value);
}
</script>

<template>
    <div class="page">
        <div class="list">
            <div class="component">
                <h2>Athlete settings</h2>
                <label for="height">Height: (m)</label>
                <input type="number" id="height" v-model="settings.height"
                    @change="updateSetting('height', ($event.target as HTMLInputElement).value)">
                <label for="weight">Weight: (kg)</label>
                <input type="number" id="weight" v-model="settings.weight"
                    @change="updateSetting('weight', ($event.target as HTMLInputElement).value)">
                <label for="max_heart_rate">Max heart rate: (bpm)</label>
                <input type="number" id="max_heart_rate" v-model="settings.max_heart_rate"
                    @change="updateSetting('max_heart_rate', ($event.target as HTMLInputElement).value)">

                <button @click="resetSettings()">Reset</button>
            </div>
            <div class="component">
                <h2>General</h2>
                <label for="setting">Delete all data stored on the browser:</label>
                <button class="danger" @click="deleteAllData">Delete all data</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>