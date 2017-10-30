/**
 * SocketIO服务
 *
 * Created by pang on 2017/6/1.
 */

function IOService(data, callback) {
    IDE.consoleLogger.debug(`IOService emit: ${data.event}`);
    this.socket.emit(data.event, JSON.stringify(data),function (respData) {
        IDE.consoleLogger.debug(`IOService callback successful: ${data.event}`);
        callback(respData);
    });
}
module.exports =  IOService;
