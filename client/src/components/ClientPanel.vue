<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/websocketApi'

const mainStore = useMainStore()
const { video, ws, roomName } = storeToRefs(mainStore)
const volume = ref(100)

function sync() {
    api.getStatus(ws.value, roomName.value)
}

</script>

<template>
    <div class="container">
        <p>ClientPanel</p>
        <button @click="sync()" type="button">sync</button>
        <input @input="video.volume = (volume / 100)" v-model="volume" type="range" min="0" max="100">
        <button @click="video.requestFullscreen()" type="button">fullscreen</button>
    </div>
</template>

<style scoped>
.container {
    border: 1px solid white;
}
</style>