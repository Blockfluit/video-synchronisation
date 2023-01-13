const { Method, Type, Scope } = require('./api-consts')

// Receiver can be client, room or rooms
function send(receiver, message, scope) {
    if(scope === Scope.GLOBAL) {
        // Sends message to all clients across all rooms
        receiver.forEach(client => {
            client.send(JSON.stringify(message))
        })
    } else if(scope === Scope.LOCAL) {
        // Sends message to all clients in specified room
        receiver.clients.forEach(client => {
            client.send(JSON.stringify(message))
        })
    } else if(scope === Scope.CLIENT) {
        // Sends message to specific client
        receiver.send(JSON.stringify(message))
    } else {
        console.log('invalid scope')
    }
}

function ping(client) {
    const message = [{"method":Method.TRACE, "type":Type.PONG}]
    send(client, message, Scope.CLIENT)
}

function patchStatus(receiver, room, scope) {
    const message = [{"method":Method.PATCH, "type":Type.STATUS}, {"play":room.play, "time":getTime(room), "duration":room.duration, "initialized":room.initialized, "index":room.index, "path":room.path, "playlist":room.playlist}]
    send(receiver, message, scope)
}

function patchRooms(receiver, rooms, scope) {
    const message = [{"method":Method.PATCH, "type":Type.ROOMS}, updatedRooms(rooms)]
    send(receiver, message, scope)
}

function patchChat(receiver, room, scope) {
    const message = [{"method":Method.PATCH, "type":Type.CHAT}, {"clients":room.clients.size, "chat":room.chat}]
    send(receiver, message, scope)
}

module.exports = { ping, patchStatus, patchRooms, patchChat }

// Helper functions
function updatedRooms(rooms) {
    let tempRooms = []
    Array.from(rooms).forEach((room) => {
        let tempRoom = Object.assign({}, room)
        tempRoom.time = getTime(tempRoom)
        tempRooms.push(tempRoom)
    })
    return tempRooms
}

function getTime(room) {
    if(room.time === 0) {
        return 0
    }
    else if(room.play === true) {
        return room.time + (performance.now() / 1000)
    } 
    else {
        return room.time
    } 
}