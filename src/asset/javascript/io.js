const connector = require('socket.io');
const md5Util = require('md5Util');
const session = require('express-session');

connector.open(session.ip);

module.exports = function () {
    return {
        send(config){
            let event = md5Util.make();

            connector.emit(config.type, {
                name: config.name,
                data: config.data,
                event
            });

            if (config.success || config.fail) {
                connector.once(event, function (data) {
                    if (data.errmsg) {
                        config.fail(data);
                    } else {
                        config.success(data);
                    }
                });
            }
        },
        on: server.on
    }
};