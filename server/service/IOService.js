/**
 * SocketIO服务
 *
 * Created by pang on 2017/6/1.
 */

function IOService(eventId, data, callback) {
    console.info("ioservice emit :" + eventId);
    this.socket.emit(eventId, JSON.stringify(data),function (respData) {
        console.info("ioservice callback successful:" + eventId);
        callback(respData);
    });
}
module.exports =  IOService;
