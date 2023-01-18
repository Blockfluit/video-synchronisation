<script setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/mainStore'
import api from '../api/api-service'
import { ref, onMounted, onUpdated } from 'vue';
import feather from 'feather-icons';

const mainStore = useMainStore()
const { ws, clientName, currentRoom, chat } = storeToRefs(mainStore)

const chatMessage = ref('')
const growChat = ref(true)
clientName.value = (Math.random() + 1).toString(36).substring(7)

function sendChat() {
    api.putChat(ws.value, currentRoom.value.name, clientName.value, chatMessage.value)
    chatMessage.value = ''
}
function toggleChat(){
    growChat.value = !growChat.value
    console.log(growChat.value)
}

onMounted(()=> {
    feather.replace();
})
onUpdated(()=>{
    feather.replace();
})
</script>

<template>
    <div v-if="growChat === false" @click="toggleChat"><i class="chat-button-show" data-feather="chevron-left"></i></div>
    <div v-if="growChat === true" @click="toggleChat"><i class="chat-button-hide" data-feather="chevron-right"></i></div>
    <div class="chat-container" :style="{display: growChat ? 'flex' : 'none'}">
        <ul>
            <template v-for="message in chat.chat">
                <li v-if="message.clientName !== clientName">{{ message.clientName + ': ' + message.message }}</li>
                <li class="right" v-else>{{ message.message }}</li>
            </template>
        </ul>
        <div class="horizontal-container">
            <p> {{ chat.clients }} <i data-feather="user"></i></p>
            <input @keyup.enter="sendChat()" v-model="chatMessage" type="text" placeholder="Type a message...">
            <button @click="sendChat()"><i data-feather="send"></i></button>
        </div>
    </div>
</template>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: inset 0px 0px 8px 0px rgba(0,0,0,0.6);
    border-radius: 8px;
    width: 100%;
    min-width: 250px;
    max-width: 250px;
    margin-left: 10px
}
.chat-button-show {
    position: absolute;
    top: 45%;
    right: 0;
    padding: 5px;
    margin-right: 12px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 25px;
    transition: all .3s ease;
}
.chat-button-show:hover {
    cursor: pointer;
    margin-right: 15px;
}
.chat-button-hide {
    position: absolute;
    top: 45%;
    right: 0;
    padding: 5px;
    margin-right: 12px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 25px;
    transition: all .3s ease;
}
.chat-button-hide:hover {
    cursor: pointer;
    margin-right: 5px;
}
input {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60%;
    height: 20px;
    font-size: 10px;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #f1f1f1;
    color: #f1f1f1;
}
input:focus{
    outline: none;
}
button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 20px;
    font-size: 10px;
    background-color: transparent;
    border: none;
    color: #f1f1f1;
    cursor: pointer;
}
p svg {
    height: 14px;
}
button svg {
    height: 14px;
}
.horizontal-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 8px;
    max-height: 20px;
}
.horizontal-container p {
    display: flex;
    align-items: center;
}
ul {
    padding: 0;
    margin: 30px;
    position: relative;
}
li {
    list-style: none;
}
.right {
    text-align: right;
}

@media screen and (max-width: 759px) {
    .chat-container{
        height: 25vh;
        margin-left: 0px;
        max-width: 100%;
    }
    .chat-button-hide {
        display: none;
    }
    .chat-button-show {
        display: none;
    }

}
@media screen and (max-width: 460px){
  .chat-container{
        height: 40vh;
    }
}
</style>