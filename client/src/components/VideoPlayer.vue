<script setup>
import Chat from './Chat.vue';
import ClientPanel from './ClientPanel.vue';
import AdminPanel from './AdminPanel.vue';
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/api-service'
import { onMounted, ref } from 'vue';

const mainStore = useMainStore()
const { roomName, ws, isAdmin, video, time, duration, chatbox, clients } = storeToRefs(mainStore)
const path = ref('')

let latency = 0

ws.value.onmessage = message => {
        let msg = JSON.parse(message.data)

        if(msg[0].method === 'patch' && msg[0].type === 'status') {
            ping()
            if(path.value !== msg[1].path) video.value.load() //loads video if source has changed
            path.value = msg[1].path
            duration.value = msg[1].duration
            video.value.currentTime = msg[1].time
            msg[1].play ? video.value.play() : video.value.pause()
        }

        if(msg[0].method === 'trace' && msg[0].type === 'pong') {
            latency += performance.now()
            video.value.currentTime += (latency / 1000 / 2)
        }
        
        if(msg[0].method === 'patch' && msg[0].type === 'chat') {
            chatbox.value = msg[1].chat
            clients.value = msg[1].clients
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

onMounted(() => {
    api.getStatus(ws.value, roomName.value)
    video.value.onloadeddata = () => {
        api.getStatus(ws.value, roomName.value)
    }
    video.value.ontimeupdate = () => {
        time.value = video.value.currentTime
    }
}) 
</script>



<template>
    <h1 @click="roomName = ''">{{ roomName }}</h1>
    <div class="horizontal-container">
        <video ref="video" width="960" height="540">
            <source :src="path" type="video/mp4">
        </video>
        <Chat/>
    </div>
    <p>{{ formatPath(path) }}</p>
    <p>{{ formatTime(time) + '/' + formatTime(duration) }}</p>
    <ClientPanel />
    <AdminPanel v-if="isAdmin"/>
</template>



<style scoped>
video::-webkit-media-controls-enclosure {
  display:none !important;
}
.horizontal-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
}

video {
    box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.6);
    border-radius: 8px;
}
</style>