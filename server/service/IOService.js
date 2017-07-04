/**
 * SocketIO服务
 *
 * Created by pang on 2017/6/1.
 */

function IOService(eventId, data,socket, callback) {
    console.info("ioservice emit :" + eventId,data);
    socket.emit(eventId, data, function (respData) {
        console.info("ioservice callback successful:" + eventId);
        callback(null, respData);
    });
}
module.exports =  IOService;
