<script setup>
import Lobby from './components/Lobby.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import AddRoom from './components/AddRoom.vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from './store/mainStore.js'

const mainStore = useMainStore()
const { currentRoom } = storeToRefs(mainStore)
</script>

<template>
  <Lobby v-if="currentRoom === null"/>
  <VideoPlayer v-if="currentRoom !== null"/>
  <AddRoom />
</template>

<style scoped>
</style>
