/**
 * 通迅类
 *
 * Created by pang on 2017/5/10.
 */

const socket_io = require('socket.io');
const socketCenter = require('./SocketCenter');
const Config = require("./Config");

const server = socket_io.listen(Config.port);

const initCommunication = exports.initCommunication = function () {
    server.on('connection', function (socket) {
        console.log('====' + 'Connect Middleware Successfully!');
        exports.initIDE(socket);
    });
};

exports.initIDE = function (socket) {
    const eventArr = socketCenter.getAllEvent();
    for (const i in eventArr) {
        const eventStr = eventArr[i];
        socket.on(eventStr, function (reqData, fn) {
            console.log('====' + 'Middleware receive command : reqInitNav');
            const service = socketCenter.getServiceByReqData(reqData);
            if (service == null || service == undefined) {
                fn({'returnCode': 'error', 'returnMsg': 'The service has not regist!'});
            } else {
                service.handle(eventStr, reqData, function (err, rspData) {
                    if (err) {
                        fn({'returnCode': 'error', 'returnMsg': err});
                    } else {
                        fn({'returnCode': 'success', 'data': rspData});
                    }
                });
            }


        });
    }

};
