<script setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/api-service'
import { onMounted } from 'vue';


const mainStore = useMainStore()
const { ws, roomName, rooms, clients } = storeToRefs(mainStore)

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

function onClick(room) {
    roomName.value = room
    clearInterval(intervalID)
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
    <div class="rooms-container">
        <h1>Rooms</h1>
        <div class="card-container" @click="onClick(room.name)" v-for="room in rooms">
            <dl>
                <dt>Room name:</dt>
                <dd>{{ room.name }}</dd>
                <dt>Currently playing:</dt>
                <dd>{{ formatPath(room.playlist[room.index].path) }}</dd>
                <dt>Time:</dt>
                <dd>{{ formatTime(room.time) }}</dd>
                <dt>Duration:</dt>
                <dd>{{ formatTime(room.playlist[room.index].duration) }}</dd>
                <dt :class="{'live': room.play && room.initialized, 'not-initialized': room.play && !room.initialized,'not-live': !room.play}">•</dt>
            </dl>
            <img :src="room.playlist[room.index].thumbnail">
        </div>
    </div>
</template>

<style scoped>
.rooms-container {
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-content: space-between;
}

.card-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 30px;
    box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.6);
    max-height: 220px;
    min-width: 350px;
    border-radius: 8px;
}

img {
    object-fit: cover;
    height: auto;
    width: 147px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
}

dl {
    margin: 10px 10px 10px 10px;
    color: #a39b8f;
    text-align: center;
}

dt {
    font-weight: bold;
    color: #ccc8c1;
    margin: 3px;
}

dd {
    margin-left: 20px;
}

.live {
  animation: blinker 2s linear infinite;
  color: green;
  font-size: xx-large;
  text-align: left;
}

.not-initialized {
    color: orange;
    font-size: xx-large;
    text-align: left;
}

.not-live {
    color: red;
    font-size: xx-large;
    text-align: left;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>