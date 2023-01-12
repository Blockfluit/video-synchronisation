const Method = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
    PATCH: 'patch',
    TRACE: 'trace'
}

const Type = {
    PING: 'ping',
    PONG: 'pong',
    STATUS: 'status',
    ROOM: 'room',
    ROOMS: 'rooms',
    CHAT: 'chat',
    PLAY: 'play',
    TIME: 'time',
    PATH: 'path'
    
}

const Scope = {
    CLIENT: 'client',
    LOCAL: 'local',
    GLOBAL: 'global'
}

module.exports = { Method, Type, Scope }