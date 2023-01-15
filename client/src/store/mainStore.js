import { ref } from 'vue'
import { defineStore } from 'pinia'

let url = 'ws://localhost:3231' // websocketserver url example: 'ws://localhost:3231'

export const useMainStore = defineStore('main', () => {
    const ws = ref(new WebSocket(url))
    const isAdmin = ref(true)
    const clientName = ref('')
    const currentRoom = ref(null)
    const roomName = ref('')
    const rooms = ref([])
    const chat = ref([])
    const time = ref(0)
    const video = ref(null)

    return { ws, isAdmin, clientName, currentRoom, roomName, rooms, chat, time, video }
})