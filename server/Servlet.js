/**
 * Created by zcn on 2017/6/15.
 */

var socket_io = require('socket.io');
var config = require('./config')
var parseCookie = require('cookie-parser')
var shareSession = require('express-socket.io-session')

function Servlet(serviceConfigs, session, http) {
    this.serviceConfigs = serviceConfigs
    this.session = session
    this.http = http
    this.consumers = {}
    this.clients = {}
}

Servlet.prototype.start = function () {
    var self = this;
    var server = socket_io(this.http)

    server.use(shareSession(this.session, {
        autoSave: true
    }))

    server.use(function (socket, next) {
        var user = socket.handshake.session.user

        if (user) {
            // 用户已登录则允许连接socket
            next()
        } else {
            next(new Error('nosession'))
        }
    })

    server.on('connection', function (socket) {
        var user = socket.handshake.session.user;

        console.info(user['_id'] + ' connect socket successful');

        self.clients[user['_id']] = socket;

        socket.on('disconnect', function () {
            delete self.clients[user['_id']]
        })

        for (let index in self.serviceConfigs) {
            let productServices = self.serviceConfigs[index];
            if (productServices.services) {
                for (let sIndex in productServices.services) {
                    let service = productServices.services[sIndex]
                    if (!service.id || !service.type) {
                        continue
                    }
                    if (service.type === 'IOService') {
                        socket.on(productServices.type + "_" + service.id, function (reqData, callback) {
                            reqData.uid = user['_id'];
                            let consumer = Products[reqData.type];
                            if (consumer) {
                                consumer.runServiceHandler(reqData, callback);
                            } else {
                                console.error('can not find consumer :' + reqData.type, reqData);
                            }
                        });
                    } else if (service.type === 'localService') {
                        socket.on(productServices.type + "_" + service.id, function (reqData, callback) {
                            reqData.uid = user['_id'];
                            service.handler.call(self,reqData,callback,service);
                        });
                    }
                }
            }
        }
    })
}

Servlet.prototype.getClient = function (id) {
    return this.clients[id];
}

Servlet.prototype.closeClient = function (id) {
    var client = this.getClient(id);
    if (client) {
        client.disconnect(true);
    }
}

module.exports = Servlet;