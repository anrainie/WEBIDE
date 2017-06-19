/**
 * Created by zcn on 2017/6/15.
 */

var socket_io = require('socket.io');
var config = require("./config");
var parseCookie = require('cookie-parser');

function Servlet(serviceConfigs,sessionStore) {
    this.serviceConfigs = serviceConfigs;
    this.sessionStore = sessionStore;
    this.consumers = {};
    this.clients = {};
}

Servlet.prototype.start = function () {
    var self = this;
    var server = socket_io.listen(config.port);

    server.on('connection', function (socket) {

        socket.on('disconnect',function () {

        });

        for(let index in self.serviceConfigs){
           let services =  self.serviceConfigs[index];
           if(services.services) {
               for(let sIndex in services.services) {
                   let service = services.services[sIndex];
                   if (!service.id) {
                       console.info('service id can not be null');
                       continue;
                   }
                   if (!service.type) {
                       console.info('service type can not be null');
                       continue;
                   }
                   if(service.type === 'IOService') {
            console.info("bind socket event:" + service.id);
                       socket.on(service.id, function (reqData, callback) {
            console.info("servlet capture socket event:",reqData.event);
                           let consumer = Products[reqData.type];
                           if (!consumer) {
                               console.info("can not find consumer :" + reqData);
                           } else {
                               consumer.runHandler(reqData, callback);
                           }
                       });
                   }else if(service.type === 'localService'){
                       socket.on(service.id, function (reqData, callback) {
                           service.handle(reqData,callback);
                       });
                   }
               }
           }
        }
    });
}

Servlet.prototype.getClient = function (id) {
    return this.clients[id];
}

module.exports =  Servlet;