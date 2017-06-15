/**
 * Created by zcn on 2017/6/15.
 */

var socket_io = require('socket.io');
var config = require("./config");

function Servlet(serviceConfigs) {
    this.serviceConfigs = serviceConfigs;
    this.consumers = {};
    this.client = {};
}

Servlet.prototype.start = function () {
    var self = this;
    var server = socket_io.listen(config.port);
    server.on('connection', function (socket) {
        //TODO 保存client
        for(let index in this.serviceConfigs){
           let services =  this.serviceConfigs[index];
           if(services.services) {
               for(let sIndex in services.services) {
                   let service = services.services[sIndex];
                   if (service.id) {
                       console.info('service id can not be null');
                       continue;
                   }
                   if (service.type) {
                       console.info('service type can not be null');
                       continue;
                   }

                   if(service.type === 'IOService') {
                       socket.on(service.id, function (reqData, callback) {
                           let consumer = self.consumers[reqData.type];
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

Servlet.prototype.addConsumer = function (consumer) {
    this.consumers[consumer.name] = consumer;
}

module.exports =  Servlet;