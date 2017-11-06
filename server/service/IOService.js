/**
 * SocketIO服务
 *
 * Created by pang on 2017/6/1.
 */

function IOService(reqData, callback) {
    this.emit(reqData.event,reqData,callback);
}
module.exports =  IOService;
