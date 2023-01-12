<script setup>
import Rooms from './components/Rooms.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from './store/mainStore.js'

const mainStore = useMainStore()
const { roomName } = storeToRefs(mainStore)
</script>

<template>
  <Rooms v-if="roomName === ''"/>
  <VideoPlayer v-if="roomName !== ''"/>
</template>

<style scoped>
</style>
