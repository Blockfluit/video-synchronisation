<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/api-service'

const mainStore = useMainStore()
const { video, ws, roomName } = storeToRefs(mainStore)
const volume = ref(100)

function sync() {
    api.getStatus(ws.value, roomName.value)
}

</script>

<template>
    <div class="panel-container">
        <p>ClientPanel</p>
        <button @click="sync()" type="button">sync</button>
        <input @input="video.volume = (volume / 100)" v-model="volume" type="range" min="0" max="100">
        <button @click="video.requestFullscreen()" type="button">fullscreen</button>
    </div>
</template>

<style scoped>
.panel-container {
    padding: 5px;
    box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.6);
    border-radius: 8px;
    width: 300px;
}
</style>