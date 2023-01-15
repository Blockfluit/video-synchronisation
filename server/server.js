const api = require('./api/api-service.js')
const { Method, Type, Scope } = require('./api/api-consts')
const data = require('./src/rooms.json')
const { Room } = require('./room.js')
const { getVideoDurationInSeconds } = require('get-video-duration')
const WebSocketServer = require('websocket').server
const http = require('http')
const httpServer = http.createServer()
const wss = new WebSocketServer({
    "httpServer": httpServer
})
const port = 3231

let rooms = new Set()
let clientsInLobby = new Set()
let allClients = new Set()
let intervalID = 0

preloadRooms()
updateIndex()

// Loads predefined rooms 
function preloadRooms() {
    data.forEach(entry => {
        let room = new Room(entry.name)
        room.index = entry.index
        room.thumbnail = entry.thumbnail
        room.playlist = entry.playlist
        room.playlist.forEach((video, index) => {
            getVideoDurationInSeconds(video.path).then((duration) => {
                if(index === room.index) {
                    room.duration = duration
                    room.path = video.path
                }
                video.duration = duration
                rooms.add(room)
            })
        })
    })
}

function updateIndex() {
    rooms.forEach(room => {
        if(getTime(room) > room.playlist[room.index].duration) {
            if(room.loop === false) {
                if(room.index === (room.playlist.length - 1)) {
                    room.index = 0
                    room.path = room.playlist[0].path
                    room.duration = room.playlist[0].duration
                } else {
                    room.index++
                    room.path = room.playlist[room.index].path
                    room.duration = room.playlist[room.index].duration
                }
            }
            setTime(room, 0)
            api.patchStatus(room, room, Scope.LOCAL)
            api.patchRooms(allClients, rooms, Scope.GLOBAL)
        }
    })
    clearInterval(intervalID)
    intervalID = setInterval(() => updateIndex(), 2000)
}

function checkRoom(roomName) {
    let exists = false
    rooms.forEach(room => {
        if(room.name === roomName) exists = true
    })
    return exists
}

function getTime(room) {
    if(room.time === 0) return 0
    if(room.play === true) {
        return room.time + (performance.now() / 1000)
    } else {
        return room.time
    } 
}

// Returns actual room object
function getRoom(roomName) {
    var room = Array.from(rooms).find(room => room.name === roomName)
    return room
}

function removeFromOtherRooms(client) {
    rooms.forEach(room => {
        room.clients.delete(client)
    })
}

function setTime(room, clientTime) {
    if(clientTime === undefined) {
        if(room.play === true) {
            room.time -= (performance.now() / 1000)
        } else {
            room.time += (performance.now() / 1000)
        }
    } else {
        if(room.play === true) {
            clientTime = parseFloat(clientTime)
            room.time = ((performance.now() / -1000) + clientTime)
        } else {
            room.time = clientTime
        }
    }
}

wss.on('request', request => {
    let client = request.accept(null, request.origin)
    console.log('Client has connected')
    allClients.add(client)
    clientsInLobby.add(client)

    // Listenes to messages and acts on them
    client.on('message', message => {
        let msg = JSON.parse(message.utf8Data)
        let room = null

        if(msg[0].method === Method.TRACE) {
            switch(msg[0].type) {
                case Type.PING:
                    api.ping(client)
                    break
            }
        }
        else if(msg[0].method === Method.GET) {
            switch(msg[0].type) {
                case Type.STATUS:
                    clientsInLobby.delete(client)
                    room = getRoom(msg[1].room)
                    room.clients.add(client)
                    if(room.initialized === false) room.initialized = true
                    if(room.time === 0) {
                        setTime(room)
                    }
                    api.patchRooms(clientsInLobby, rooms, Scope.GLOBAL)
                    api.patchStatus(client, room, Scope.CLIENT)
                    api.patchChat(room, room, Scope.LOCAL)
                    break
                case Type.ROOMS:
                    clientsInLobby.add(client)
                    api.patchRooms(clientsInLobby, rooms, Scope.GLOBAL)
                    removeFromOtherRooms(client)
                    rooms.forEach((room) => {
                        api.patchChat(room, room, Scope.LOCAL)
                    }) 
                    break
            }
        }
        else if(msg[0].method === Method.PUT) {
            switch(msg[0].type) {
                case Type.CHAT:
                    room = getRoom(msg[1].room)
                    room.chat.push({"clientName":msg[1].clientName, "message":msg[1].message})
                    api.patchChat(room, room, Scope.LOCAL)
                    break
            }
        } 
        else if(msg[0].method === Method.POST) {
            switch(msg[0].type) {
                case Type.ROOM:
                    if(!checkRoom(msg[1].room)) {
                        room = new Room(msg[1].room)
                        console.log(`room created: ${room.name}`)
                        rooms.add(room)
                        api.patchRooms(clientsInLobby, rooms, Scope.GLOBAL)
                    }
                    break
                case Type.PATH:
                    // TODO: needs fixing
                    room = getRoom(msg[1].room)
                    room.playlist[1][playist[0].current] = msg[1].path
                    room.time = 0
                    api.patchStatus(clientsInLobby, room, Scope.GLOBAL)
                    break
                case Type.TIME:
                    room = getRoom(msg[1].room)
                    setTime(room, msg[1].time)
                    api.patchStatus(room, room, Scope.LOCAL)
                    api.patchRooms(clientsInLobby, rooms, Scope.GLOBAL)
                    break
            }
        } 
        else if(msg[0].method === Method.PATCH){
            switch(msg[0].type) {
                case Type.STATUS:
                    room = getRoom(msg[1].room)
                    api.patchStatus(room, room, Scope.LOCAL)
                    break
                case Type.PLAY:
                    room = getRoom(msg[1].room)
                    room.play = !room.play
                    setTime(room)
                    api.patchStatus(room, room, Scope.LOCAL)
                    api.patchRooms(clientsInLobby, rooms, Scope.GLOBAL)
                    break
                case Type.PATH:
                    room = getRoom(msg[1].room)
                    room.path = msg[1].path 
                    setTime(room, 0)
                    getVideoDurationInSeconds(msg[1].path).then((duration) => {
                        room.duration = duration
                        api.patchStatus(room, room, Scope.LOCAL)
                    })
                    break
            }

        } 
        else if(msg[0].method === Method.DELETE) {
            switch(msg[0].type) {
                case Type.CHAT:
                    room = getRoom(msg[1].room)
                    room.chat = []
                    api.patchChat(room, room, Scope.LOCAL)
                    break
            }
        }
    })

    client.on('close', () => {
        rooms.forEach((room) => {
            room.clients.delete(client)
        })
        console.log('Client has disconnected')
    })
})

httpServer.listen(port, () => console.log(`listening on port: ${port}`))