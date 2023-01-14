<script setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "../store/mainStore";
import api from "../api/api-service";
import { onMounted } from "vue";

const mainStore = useMainStore();
const { ws, roomName, rooms, clients } = storeToRefs(mainStore);

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

function onClick(room) {
  roomName.value = room;
  clearInterval(intervalID);
}

function formatTime(sec) {
  if (!isNaN(sec)) {
    let data = new Date(parseInt(sec) * 1000).toISOString().substr(11, 8);
    return data;
  }
  return "00:00:00";
}

function formatPath(path) {
  let fileName = path
    .replace(/\.[^/.]+$/, "")
    .split("/")
    .pop();
  return fileName;
}

onMounted(() => {
  api.getRooms(ws.value);
});
</script>

<template>
  <div class="container">
    <div class="cinema-wrapper">
      <h1>Cinema's</h1>
      <div class="cinema-container">
        <div class="cinema-card"></div>
      </div>
    </div>
    <div class="rooms-wrapper">
      <h1>Channels</h1>
      <div class="rooms-container">
        <div
          class="room-card"
          @click="onClick(room.name)"
          v-for="room in rooms"
          :key="room.name"
        >
          <div class="room-info">
            <div>
              <h2>{{ room.name }}</h2>
              <!-- <p class="room-path ellipsis">
                Playing:
                {{ formatPath(room.playlist[room.index].path) }}
              </p> -->
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
                <p class="room-participants">0 Viewers</p>
              </div>
              <p class="room-time">
                {{ formatTime(room.time) }}/{{
                  formatTime(room.playlist[room.index].duration)
                }}
              </p>
            </div>
          </div>
          <div class="room-image">
            <img :src="room.playlist[room.index].thumbnail" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  padding: 0px 50px 0px 50px;
}

.container h1 {
  margin-top: 5vh;
}
.cinema-card {
  width: 60vw;
  height: 80vh;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.6);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}
.rooms-wrapper h1 {
  padding-left: 10px;
}
.rooms-container {
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px 10px;
  height: 79vh;
}
.cinema-container {
  padding: 10px 0px;
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
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.6);
  max-width: 30vw;
  border-radius: 8px;
  cursor: pointer;
  box-sizing: border-box;
}
.room-card:hover {
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.6) !important;
}
.room-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 20px 10px 20px;
  margin: 0;
  overflow: hidden;
  min-width: 40%;
  max-width: 40%;
}
.room-info h2 {
  font-weight: bold;
  margin: 0;
}
.room-image {
  width: 60%;
}
.room-image img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
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

/*Scrollbar*/
/* width */
::-webkit-scrollbar {
  width: 3px;
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