class Room {
    constructor(name) {
        this.name = name
        this.play = true
        this.initialized = false
        this.loop = false
        this.time = 0
        this.index = 0
        this.path = ''
        this.duration = 0
        this.loop = false 
        this.autoplay = true
        this.thumbnail = ''
        this.playlist = []
        this.clients = new Set()
        this.chat = []
    }
}

module.exports = { Room }