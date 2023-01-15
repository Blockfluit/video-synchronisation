<script setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/api-service'
import { ref, onMounted, onUpdated } from 'vue';
import feather from 'feather-icons';

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
onMounted(()=>{
    feather.replace();
})
onUpdated(()=> {
    feather.replace();
})
</script>

<template>
    <div class="panel-container">
        <div class="wrapper">
            <button @click="play()" type="button"><i data-feather="play"></i><i style="margin-left: -16px;" data-feather="pause"></i></button>
            <button @click="syncClients()" type="button">sync clients</button>
            <button @click="clearChat()" type="button">clear chat</button>
            <input @keyup.enter="setTime(time + inputTime); inputTime = null" v-model="inputTime" type="number" placeholder="Add time in sec." min="0">
            <input @keyup.enter="setPath(path)" v-model="path" type="text" placeholder="Path">
        </div>
        <p>{{ formatTime(time) }}</p>
        <input class="time-slider" @change="setTime(time)" @input="() => video.currentTime = time" v-model="time" type="range" :max="duration">
    </div>
</template>

<style scoped>
.panel-container {
    border-radius: 8px;
    margin-top: 10px;
    margin-right: 50px;
    padding: 5px;
}
.wrapper {
    display: flex;
    align-items: center;
}

button{
    display: flex;
    align-items: center;
    background-color: transparent;
    margin-right:10px;
    border: none;
    color: #f1f1f1;
    cursor: pointer;
}
button:hover{
    color: #bbbbbb;
    stroke: #bbbbbb;
}
svg {
    height: 14px;
    stroke: #f1f1f1;
}

input{
    margin-right:10px;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #f1f1f1;
    color: #f1f1f1;
}
input:focus{
    outline: none;
}
.time-slider {
    width: 100%;
}
</style>