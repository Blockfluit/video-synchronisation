<script setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/api-service'
import { ref } from 'vue';

const mainStore = useMainStore()
const { video, ws, roomName, time, duration } = storeToRefs(mainStore)
const inputTime = ref(null)
const path = ref('')

function play() {
    api.patchPlay(ws.value, roomName.value)
}

function syncClients() {
    api.patchStatus(ws.value, roomName.value)
}

function clearChat() {
    api.deleteChat(ws.value, roomName.value)
}

function setTime(time) {
    api.postTime(ws.value, roomName.value, time)
}

function setPath(path) {
    api.patchPath(ws.value, roomName.value, path)
}

function formatTime(sec) {
    if(!isNaN(sec)) {
        var data = new Date(parseInt(sec) * 1000).toISOString().substr(11, 8)
        return data
    }
    return '00:00:00'
}
</script>

<template>
    <div class="panel-container">
        <p>Admin panel</p>
        <button @click="play()" type="button">play/pause</button>
        <button @click="syncClients()" type="button">sync clients</button>
        <button @click="clearChat()" type="button">clear chat</button>
        <p>{{ formatTime(time) }}</p>
        <input class="time-slider" @change="setTime(time)" @input="() => video.currentTime = time" v-model="time" type="range" :max="duration">
        <input @keyup.enter="setTime(time + inputTime); inputTime = null" v-model="inputTime" type="number" placeholder="Add time in sec." min="0">
        <input @keyup.enter="setPath(path)" v-model="path" type="text" placeholder="Path">
    </div>
</template>

<style scoped>
.panel-container {
    box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.6);
    border-radius: 8px;
    margin-top: 10px;
    padding: 5px;
}

.time-slider {
    width: 100%;
}
</style>