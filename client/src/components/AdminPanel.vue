<script setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/api-service'
import { ref } from 'vue';

const mainStore = useMainStore()
const { video, ws, currentRoom, time } = storeToRefs(mainStore)
const inputTime = ref(null)
const path = ref('')

function play() {
    api.patchPlay(ws.value, currentRoom.value.name)
}

function syncClients() {
    api.patchStatus(ws.value, currentRoom.value.name)
}

function clearChat() {
    api.deleteChat(ws.value, currentRoom.value.name)
}

function setTime(time) {
    api.postTime(ws.value, currentRoom.value.name, time)
}

function setPath() {
    api.patchPath(ws.value, currentRoom.value.name, path.value)
}

function setIndex(index) {
    let tempIndex = currentRoom.value.index + index

    if(tempIndex > (currentRoom.value.playlist.length - 1)) {
        tempIndex = 0
    }
    else if(tempIndex < 0) {
        tempIndex = (currentRoom.value.playlist.length - 1)
    }
    api.patchIndex(ws.value, currentRoom.value.name, tempIndex)
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
        <button @click="setIndex(-1)" type="button">prev</button>
        <button @click="setIndex(1)" type="button">next</button>
        <button @click="play()" type="button">play/pause</button>
        <button @click="syncClients()" type="button">sync clients</button>
        <button @click="clearChat()" type="button">clear chat</button>
        <p>{{ formatTime(time) }}</p>
        <input class="time-slider" @change="setTime(time)" @input="() => video.currentTime = time" v-model="time" type="range" :max="currentRoom.duration">
        <input @keyup.enter="setTime(time + inputTime); inputTime = null" v-model="inputTime" type="number" placeholder="Add time in sec." min="0">
        <input @keyup.enter="setPath()" v-model="path" type="text" placeholder="Path">
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