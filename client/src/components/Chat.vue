<script setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/websocketApi'
import { ref } from 'vue';

const mainStore = useMainStore()
const { ws, roomName, chatbox, clients } = storeToRefs(mainStore)

const chatMessage = ref('')

function sendChat() {
    api.putChat(ws.value, roomName.value, chatMessage.value)
    chatMessage.value = ''
}
</script>

<template>
     <div class="chat-container">
        <ul>
            <li v-for="message in chatbox">{{ message.clientName + ': ' +message.message }}</li>
        </ul>
        <div class="horizontal-container">
            <p> {{ clients }} </p>
            <input @keyup.enter="sendChat()" v-model="chatMessage" type="text" placeholder="Type a message">
            <button @click="sendChat()">send</button>
        </div>
    </div>
</template>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.horizontal-container {
    display: flex;
    flex-direction: row;
    height: 25px;
}

p {
    flex-grow: 2;
}

input {
    flex-grow: 4;
}

button {
    flex-grow: 3;
}
</style>