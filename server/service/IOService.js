/**
 * SocketIO服务
 *
 * Created by pang on 2017/6/1.
 */

function IOService(eventId, data, callback) {
    IDE.consoleLogger.debug(`IOService emit: ${eventId}`);
    this.socket.emit(eventId, JSON.stringify(data),function (respData) {
        IDE.consoleLogger.debug(`IOService callback successful: ${eventId}`);
        callback(respData);
    });
}
module.exports =  IOService;
