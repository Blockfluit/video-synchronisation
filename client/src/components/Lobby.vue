<script setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "../store/mainStore";
import feather from "feather-icons";
import api from "../api/api-service";
import { onMounted, onUpdated } from "vue";

const mainStore = useMainStore();
const { ws, currentRoom, rooms } = storeToRefs(mainStore);

let intervalID = 0;

ws.value.onmessage = (message) => {
  let msg = JSON.parse(message.data);

  if (msg[0].method === "patch" && msg[0].type === "rooms") {
    setRooms(msg[1]);
  }
};

function setRooms(tempRooms) {
  if (tempRooms === undefined) {
    const map = rooms.value.map((room) => {
      if (room.time !== 0 && room.play === true) room.time++;
      return room;
    });
    rooms.value = map;
  } else {
    rooms.value = tempRooms;
    clearInterval(intervalID);
    intervalID = setInterval(() => setRooms(), 1000);
  }
}

function getDuration(room) {
    let duration = 0
    if(room.playlist.length !== 0) room.playlist[room.index].duration
    return duration
}

function getPath(room) {
    let path = ''
    if(room.playlist.length !== 0) {
        path = room.playlist[room.index].path
    }
    return path
}

function onClick(room) {
    currentRoom.value = room
    clearInterval(intervalID)
}

function formatTime(sec) {
  if (!isNaN(sec)) {
    let data = new Date(parseInt(sec) * 1000).toISOString().substr(11, 8);
    return data;
  }
  return "00:00:00";
}

function formatPath(path) {
    if(path !== '') {
        let fileName = path
        .replace(/\.[^/.]+$/, "")
        .split('/')
        .pop()
        return fileName
    }
}

onMounted(() => {
  api.getRooms(ws.value);
  feather.replace();
});

onUpdated(()=> {
  feather.replace();
})
</script>

<template>
  <div class="container">
    <div class="cinema-wrapper">
      <h1 style="margin-left: 10px;">Cinema's</h1>
      <div class="cinema-container">
      <template class="scroll" v-for="room in rooms">
        <li class="cinema-card" @click="onClick(room)" v-if="room.type === 'cinema'">
          <div class="relative-cinema">
            <div class="darken"></div>
            <div class="cinema-info">
              <div>
                <h2>{{ room.name }}</h2>
              </div>
              <div class="dot-indicator">
                <div style="display: flex; align-items: center">
                  <div
                    class="dot"
                    :class="{
                      live: room.play && room.initialized,
                      'not-initialized': room.play && !room.initialized,
                      'not-live': !room.play,
                    }"
                  ></div>
                  <p class="room-participants">{{ room.clients }}<i data-feather="user"></i></p>
                </div>
                <p class="room-time">
                  {{ formatTime(room.time) }}
                  /{{ formatTime(room.duration) }}
                </p>
              </div>
            </div>
            <div class="room-image">
            <img :src="room.playlist[room.index].thumbnail"/>
            </div>
          </div>
        </li>
      </template>
      </div>
    </div>
    <div class="rooms-wrapper">
      <h1>Channels</h1>
      <div class="rooms-container">
      <template v-for="room in rooms">
        <li
          class="room-card"
          @click="onClick(room)"
          v-if="room.type === 'channel'"
        >
          <div class="relative">
            <div class="darken"></div>
            <div class="room-info">
              <div>
                <h2>{{ room.name }}</h2>
              </div>
              <div class="dot-indicator">
                <div style="display: flex; align-items: center">
                  <div
                    class="dot"
                    :class="{
                      live: room.play && room.initialized,
                      'not-initialized': room.play && !room.initialized,
                      'not-live': !room.play,
                    }"
                  ></div>
                  <p class="room-participants">{{ room.clients }}<i data-feather="user"></i></p>
                </div>
                <p class="room-time">
                  {{ formatTime(room.time) }}/{{
                    formatTime(room.playlist[room.index].duration)
                  }}
                </p>
              </div>
            </div>
            <div class="room-image">
            <img :src="room.thumbnail" />
          </div>
          </div>
        </li>
      </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0px 50px 0px 50px;
}

.container h1 {
  margin-top: 5vh;
}
.cinema-card {
  width: 40vw;
  height: 40vh;
  min-width: 550px;
  max-width: 550px;
  height: 100%;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  margin-bottom: 30px;
  margin: 0px 10px;
}
.cinema-card:hover {
  box-shadow: 0px 0px 15px 0px rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
.cinema-container {
  display: flex;
  padding: 10px 0px;
  overflow-x: auto;
  overflow-y: hidden;
  height: 41vh;
}
.cinema-wrapper {
  height: 50vh;
}
.darken{
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  border-radius: 8px;
  top: 0;
  left: 0;
}

.darken:hover{
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.rooms-wrapper h1 {
  padding-left: 10px;
}
.rooms-container {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 10px 10px;
  height: 30vh;
  border-radius: 8px;
}
.rooms-wrapper{
  height: 50vh;
}
.room-participants {
  display: flex;
  align-items: center;
}
.relative {
  position: relative;
  border-radius: 8px;
  height: 100%;
  width: 100%;
}
.relative-cinema {
  position: relative;
  border-radius: 8px;
  height: 100%;
  width: 100%;
}
.room-participants svg {
  height: 14px;
  stroke-width: 2;
}

.dot-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.dot-indicator p {
  margin: 0;
  font-size: 12px;
}
.room-card {
  margin-right: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  min-width: 350px;
  max-width: 350px;
  cursor: pointer;
  position: relative;
}
.room-card:hover {
  box-shadow: 0px 0px 15px 0px rgba(255, 255, 255, 0.1);
}
.room-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 20px 10px 20px;
  margin: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
.cinema-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 20px 10px 20px;
  margin: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
.room-info h2 {
  font-weight: bold;
  margin: 0;
}
.room-image {
  width: 100%;
  height: 100%;
}
.room-image img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  border-radius: 8px;
}
.live {
  animation: blinker 2s linear infinite;
  background-color: green;
  font-size: xx-large;
  text-align: left;
}
.dot {
  height: 7px;
  width: 7px;
  border-radius: 25px;
  margin-right: 8px;
}
.not-initialized {
  background-color: orange;
  font-size: xx-large;
  text-align: left;
}

.not-live {
  background-color: red;
}
.ellipsis {
  text-overflow: ellipsis;

  /* Required for text-overflow to do anything */
  white-space: nowrap;
  overflow: hidden;
}

li {
  list-style: none;
}

/*Scrollbar*/
/* width */
::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #1e1e1e;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #f1f1f1;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: white;
}
@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>