const server = require('socket.io');
const md5Util = require('md5Util');
const session = require('express-session');
const serviceReg = require('./serviceReg');


// server.open(session.ip);

const services = serviceReg.all(session.user);

for (let service in services) {
    server.on(service.type, function (data) {
        //nodejs转发请求交给服务处理
        service.handle(data,function(result){
            server.emit(data.event,result);
        });
    });
}

// module.exports = function () {
//     return {
//         send(config){
//             let event = md5Util.make();
//
//             server.emit(config.type, {
//                 name: config.name,
//                 data: config.data,
//                 event: event
//             });
//         },
//         on: server.on
//     }
// };