/**
 * SocketIO服务
 *
 * Created by pang on 2017/6/1.
 */
const SocketPool = require('./SocketPool');

const service = function () {
    this.handle = function (eventStr, data, callback) {
        const username = data.user;
        const idename = data.type;
        SocketPool.getConnection(username, idename, function (err, client) {
            if (err) {
                callback(err, null);
            } else {
                client.on('connect', function (socket) {
                    console.log('connect 9090 successfully!');

                });
                client.emit(eventStr, data, function (rspData) {
                    callback(null, rspData);
                });
            }

        });
    }


}

module.exports = service;
