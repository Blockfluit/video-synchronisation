<script setup>
import Chat from './Chat.vue';
import ClientPanel from './ClientPanel.vue';
import AdminPanel from './AdminPanel.vue';
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/api-service'
import { onMounted, onUpdated, ref } from 'vue';
import feather from 'feather-icons';

const mainStore = useMainStore()
const { ws, currentRoom, isAdmin, video, time, chat } = storeToRefs(mainStore)

let latency = 0

ws.value.onmessage = message => {
        let msg = JSON.parse(message.data)

        if(msg[0].method === 'patch' && msg[0].type === 'status') {
            ping()
            if(currentRoom.value.path !== msg[1].path) video.value.load() //loads video if source has changed
            currentRoom.value = msg[1]
            video.value.currentTime = msg[1].time
            msg[1].play ? video.value.play() : video.value.pause()
        }

        if(msg[0].method === 'trace' && msg[0].type === 'pong') {
            latency += performance.now()
            video.value.currentTime += (latency / 1000 / 2)
        }
        
        if(msg[0].method === 'patch' && msg[0].type === 'chat') {
            chat.value = msg[1]
        }
}

function ping() {
    api.ping(ws.value)
    latency -= performance.now()
}

function formatTime(sec) {
    if(!isNaN(sec)) {
        let data = new Date(parseInt(sec) * 1000).toISOString().substr(11, 8)
        return data
    }
    return '00:00:00'
}

function formatPath(path) {
    let fileName = path.replace(/\.[^/.]+$/, "").split('/').pop()
    return fileName
}

function onClick() {
    video.value = null
    currentRoom.value = null
    api.getRooms(ws.value)
}

onMounted(() => {
    feather.replace();
    api.getStatus(ws.value, currentRoom.value.name)
    video.value.onloadeddata = () => {
        setTimeout(() => api.getStatus(ws.value, currentRoom.value.name), 200)
    }
    video.value.ontimeupdate = () => {
        time.value = video.value.currentTime
    }
})

onUpdated(() => {
    feather.replace();
})
</script>



<template>
    <div @click="onClick()" class="back-wrapper">
        <i data-feather="chevron-left"></i>
        <h1 style="margin-left: 10px;" >{{ currentRoom.name }}</h1>
    </div>
    <div class="horizontal-container">
        <video ref="video" class="video-player">
            <source :src="currentRoom.path" type="video/mp4">
        </video>
        <Chat />
    </div>
    <div style="margin-left: 50px; margin-top: 5px;">
        <div style="display: flex; justify-content: space-between; width: 70vw;">
            <ClientPanel/>
            <p>{{ formatTime(time) + '/' + formatTime(currentRoom.duration) }}</p>
            <p>{{ formatPath(currentRoom.path) }}</p>
            
        </div>
        <AdminPanel v-if="isAdmin"/>
    </div>
</template>



<style scoped>
.back-wrapper {
    display: flex;
    align-items: center;
    width: 250px;
    margin: 20px 0px 0px 20px; 
    cursor: pointer;
}

video::-webkit-media-controls-enclosure {
  display:none !important;
}
.horizontal-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    width: 100%;
}
.video-player {
    width: 70vw;
    max-height: 70vh;
    margin-left: 50px;
}

video {
    box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.6);
    border-radius: 8px;
}
</style>