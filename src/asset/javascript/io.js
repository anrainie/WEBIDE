const connector = require('socket.io');
const md5Util = require('md5Util');
const session = require('express-session');

connector.open(session.ip);

module.exports = function () {
    return {
        send(config, callback){
            let event = md5Util.make();

            connector.emit(config.type, {
                name: config.name,
                data: config.data,
                event: event
            });

            if (callback) {
                connector.once(event, callback);
            }
        },
        on: server.on
    }
};