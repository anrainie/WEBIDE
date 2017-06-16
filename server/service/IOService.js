/**
 * SocketIO服务
 *
 * Created by pang on 2017/6/1.
 */

function IOService() {
    
}

IOService.prototype.handle = function (eventId, data,socket, callback) {
    console.info("ioservice emit :" + eventId,data);
    socket.emit(eventId, data, function (respData) {
        console.info("ioservice respData :" + respData);
        callback(null, respData);
    });
}

module.exports =  IOService;
