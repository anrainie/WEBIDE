/**
 * SocketIO服务
 *
 * Created by pang on 2017/6/1.
 */

function IOService() {
    
}

IOService.prototype.handle = function (eventId, data,socket, callback) {
    socket.emit(eventId, data, function (respData) {
        callback(null, respData);
    });
}

module.exports =  IOService;
