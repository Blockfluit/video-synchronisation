<script setup>
import feather from 'feather-icons';
import Lobby from "./components/Lobby.vue";
import VideoPlayer from "./components/VideoPlayer.vue";
import { storeToRefs } from "pinia";
import { useMainStore } from "./store/mainStore.js";
import { onMounted } from "vue";

const mainStore = useMainStore();
const { roomName } = storeToRefs(mainStore);

onMounted(()=> {
  feather.replace()
})

</script>

<template>
  <Lobby v-if="roomName === ''" />
  <VideoPlayer v-if="roomName !== ''" />
</template>

<style scoped>
</style>
