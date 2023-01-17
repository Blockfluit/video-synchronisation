import { Method, Type } from './api-consts'

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

function postRoom(websocket, roomName, thumbnail) {
    send(websocket, [{"method":Method.POST, "type":Type.ROOM}, {"room":roomName, "thumbnail":thumbnail}])
}

function putChat(websocket, roomName, clientName, message) {
    send(websocket, [{"method":Method.PUT, "type":Type.CHAT}, {"room":roomName, "clientName":clientName, "message":message}])
}

function patchPath(websocket, roomName, path) {
    send(websocket, [{"method":Method.PATCH, "type":Type.PATH}, {"room":roomName, "path":path}])
}

function patchPlay(websocket, roomName) {
    send(websocket, [{"method":Method.PATCH, "type":Type.PLAY}, {"room":roomName}])
}

function patchIndex(websocket, roomName, index) {
    send(websocket, [{"method":Method.PATCH, "type":Type.INDEX}, {"room":roomName, "index":index}])
}

function patchAutoplay(websocket, roomName, autoplay) {
    send(websocket, [{"method":Method.PATCH, "type":Type.AUTOPLAY}, {"room":roomName, "autoplay":autoplay}])
}

function patchLoop(websocket, roomName, loop) {
    send(websocket, [{"method":Method.PATCH, "type":Type.LOOP}, {"room":roomName, "loop":loop}])
}

function patchStatus(websocket, roomName) {
    send(websocket, [{"method":Method.PATCH, "type":Type.STATUS}, {"room":roomName}])
}

function deleteChat(websocket, roomName) {
    send(websocket, [{"method":Method.DELETE, "type":Type.CHAT}, {"room":roomName}])
}

export default { ping, getRooms, getStatus, postTime, postPath, postRoom, patchPath, patchPlay, putChat, patchIndex, patchLoop, patchAutoplay, patchStatus, deleteChat }