class Room {
    constructor(name) {
        this.name = name
        this.play = true
        this.initialized = false
        this.loop = false
        this.type = ''
        this.time = 0
        this.index = 0
        this.path = ''
        this.duration = 0
        this.loop = false 
        this.autoplay = true
        this.thumbnail = 'https://images.adsttc.com/media/images/58d5/3a58/e58e/ce48/a700/003f/large_jpg/002.jpg?1490369108'
        this.playlist = []
        this.clients = new Set()
        this.chat = []
    }
}

module.exports = { Room }