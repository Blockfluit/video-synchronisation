<script setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/api-service'
import { ref, onMounted, onUpdated } from 'vue';
import feather from 'feather-icons';

const mainStore = useMainStore()
const { video, ws, currentRoom, time } = storeToRefs(mainStore)
const autoplay = ref(true)
const loop = ref(false)
const inputTime = ref(null)
const path = ref('')

function setPlay() {
    api.patchPlay(ws.value, currentRoom.value.name)
}

function setAutoplay() {
    api.patchAutoplay(ws.value, currentRoom.value.name, !autoplay.value)
}

function setLoop() {
    api.patchLoop(ws.value, currentRoom.value.name, !loop.value)
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
            <button @click="setIndex(-1)" type="button">prev</button>
            <button @click="setIndex(1)" type="button">next</button>
            <button @click="setPlay()" type="button"><i data-feather="play"></i><i style="margin-left: -16px;" data-feather="pause"></i></button>
            <label>autoplay<input @click="setAutoplay()" type="checkbox" v-model="autoplay"></label>
            <label>loop<input @click="setLoop()" type="checkbox" v-model="loop"></label>
            <button @click="syncClients()" type="button">sync clients</button>
            <button @click="clearChat()" type="button">clear chat</button>
            <div style="display: flex;">
                <input @keyup.enter="setTime(time + inputTime); inputTime = null" v-model="inputTime" type="number" placeholder="Add time in sec." min="0">
                <input @keyup.enter="setPath(path)" v-model="path" type="text" placeholder="Path">
            </div>
        </div>
        <input class="time-slider" @change="setTime(time)" @input="() => video.currentTime = time" v-model="time" type="range" :max="currentRoom.duration">
    </div>
</template>

<style scoped>
.panel-container {
    border-radius: 8px;
    padding: 10px 10px;
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
    font-size: 12px;
}
label {
    display: flex;
    font-size: 12px;
}
input[type="checkbox"]{
    margin-left: 5px;
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