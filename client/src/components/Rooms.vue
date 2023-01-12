<script setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/websocketApi'
import { onMounted } from 'vue';

const mainStore = useMainStore()
const { ws, roomName, rooms } = storeToRefs(mainStore)

let intervalID = 0

ws.value.onmessage = message => {
        let msg = JSON.parse(message.data)

        if(msg[0].method === 'patch' && msg[0].type === 'rooms') {
            setRooms(msg[1])
        }
}

function setRooms(tempRooms) {
        if(tempRooms === undefined) {
            const map = rooms.value.map(room => {
                if(room.time !== 0 && room.play === true) room.time++
                return room
            })
            rooms.value = map
        } else {
            rooms.value = tempRooms
            clearInterval(intervalID)
            intervalID = setInterval(() => setRooms(), 1000)
        }
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
    api.getRooms(ws.value)
})
</script>

<template>
    <div class="container">
        <h1>Rooms</h1>
        <div class="container-item">
            <h2 @click="roomName = room.name" v-for="room in rooms"> 
                Room name: {{ room.name }}
                <ul>
                    <li>Currently playing: {{ formatPath(room.playlist[room.index].path) }}</li>
                    <li>Playing: {{ room.play }}</li>
                    <li>Time: {{ formatTime(room.time) }}</li>
                    <li>Duration: {{ formatTime(room.playlist[room.index].duration) }}</li>
                </ul>
            </h2>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

h2 {
    border: 1px solid white;
}

li {
    font-style: italic;
}
</style>