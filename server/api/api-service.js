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
    const message = [{"method":Method.PATCH, "type":Type.STATUS}, formatRoom(room)]
    send(receiver, message, scope)
}

function patchRooms(receiver, rooms, scope) {
    const message = [{"method":Method.PATCH, "type":Type.ROOMS}, formatRooms(rooms)]
    send(receiver, message, scope)
}

function patchChat(receiver, room, scope) {
    const message = [{"method":Method.PATCH, "type":Type.CHAT}, {"clients":room.clients.size, "chat":room.chat}]
    send(receiver, message, scope)
}

module.exports = { ping, patchStatus, patchRooms, patchChat }

// Helper functions
function formatRoom(room) {
    let formattedRoom = Object.assign({}, room)
    formattedRoom.time = getTime(formattedRoom)
    formattedRoom.clients = formattedRoom.clients.size
    return formattedRoom
}

function formatRooms(rooms) {
    let tempRooms = []
    Array.from(rooms).forEach((room) => {
        let formattedRoom = formatRoom(room)
        tempRooms.push(formattedRoom)
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