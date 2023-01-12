import { Method, Type } from './types'

function send(websocket, message) {
    if(websocket.readyState === 1) {
        websocket.send(JSON.stringify(message))
    } else {
        setTimeout(() => send(websocket, message), 200)
    }
}

function ping(websocket) {
    send(websocket, [{"method":Method.TRACE, "type":Type.PING}])
}

function getRooms(websocket) {
    send(websocket, [{"method":Method.GET, "type":Type.ROOMS}])
}

function getStatus(websocket, roomName) {
    send(websocket, [{"method":Method.GET, "type":Type.STATUS}, {"room":roomName}])
}

function postTime(websocket, roomName, time) {
    send(websocket, [{"method":Method.POST, "type":Type.TIME}, {"room":roomName, "time":time}])
}

function postPath(websocket, roomName, path) {
    send(websocket, [{"method":Method.POST, "type":Type.PATH}, {"room":roomName, "path":path}])
}

function postRoom(websocket, roomName) {
    send(websocket, [{"method":Method.POST, "type":Type.ROOM}, {"room":roomName}])
}

function putChat(websocket, roomName, message) {
    console.log(websocket)
    send(websocket, [{"method":Method.PUT, "type":Type.CHAT}, {"room":roomName, "clientName":"TestClient", "message":message}])
}

function patchPath(websocket, roomName, path) {
    send(websocket, [{"method":Method.PATCH, "type":Type.PATH}, {"room":roomName, "path":path}])
}

function patchPlay(websocket, roomName) {
    send(websocket, [{"method":Method.PATCH, "type":Type.PLAY}, {"room":roomName}])
}

function patchStatus(websocket, roomName) {
    send(websocket, [{"method":Method.PATCH, "type":Type.STATUS}, {"room":roomName}])
}

function deleteChat(websocket, roomName) {
    send(websocket, [{"method":Method.DELETE, "type":Type.CHAT}, {"room":roomName}])
}

export default { ping, getRooms, getStatus, postTime, deleteChat, postPath, postRoom, patchPath, patchPlay, putChat, patchStatus }