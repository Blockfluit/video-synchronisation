<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/api-service'
import feather from 'feather-icons';
import { onMounted, onUpdated } from 'vue';

const mainStore = useMainStore()
const { video, ws, currentRoom } = storeToRefs(mainStore)
const volume = ref(100)

function sync() {
    api.getStatus(ws.value, currentRoom.value.name)
}
onMounted(() => {
    feather.replace()
})
onUpdated(() => {
    feather.replace()
})
</script>

<template>
    <div class="panel-container">
        <button @click="sync()" type="button"><i class="button" data-feather="refresh-cw"></i></button>
        <div style="display: flex; align-items: center;">
            <i data-feather="volume-2"></i>
            <input @input="video.volume = (volume / 100)" v-model="volume" type="range" min="0" max="100">
        </div>
        <button @click="video.requestFullscreen()" type="button"><i class="button" data-feather="maximize"></i></button>
    </div>
</template>

<style scoped>
.panel-container {
    display: flex;
    padding: 5px;
    align-items: center; 
    justify-content: space-between; 
    width: 300px;
}

button{
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
}
svg {
    height: 20px;
    stroke: #f1f1f1;
}
.button:hover {
    stroke: #bbbbbb;
}
</style>