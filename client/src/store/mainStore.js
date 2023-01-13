import { ref } from 'vue'
import { defineStore } from 'pinia'

let url = 'ws://localhost:3231' // websocketserver url example: 'ws://localhost:3231'

export const useMainStore = defineStore('main', () => {
    const ws = ref(new WebSocket(url))
    const isAdmin = ref(true)
    const clientName = ref('')
    const roomName = ref('')
    const rooms = ref([])
    const chatbox = ref([])
    const time = ref(0)
    const duration = ref(0)
    const clients = ref(0)
    const video = ref(null)

    return { ws, isAdmin, clientName, roomName, rooms, chatbox, time, duration, clients, video }
})
