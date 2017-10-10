/**
 * Created by zcn on 2017/6/15.
 */

var socket_io = require('socket.io');
var config = require('./config')
var parseCookie = require('cookie-parser')
var shareSession = require('express-socket.io-session')
var dbConstants = require('./constants/DBConstants')

function Servlet(serviceConfigs, session, http) {
    this.serviceConfigs = serviceConfigs;
    this.session = session;
    this.http = http;
}

Servlet.prototype.start = function () {
    var self = this;
    var server = socket_io(this.http);

    server.use(shareSession(this.session, {
        autoSave: true
    }))

    server.use(function (socket, next) {
        var user = socket.handshake.session.user;
        if (user) {
            // 用户已登录则允许连接socket
            next();
        } else {
            next(new Error('nosession'));
        }
    })

    server.on('connection', function (socket) {
        let user = socket.handshake.session.user;
        let idetype = socket.handshake.query.type;
        self.addClient(idetype,user,socket);
    })
}

Servlet.prototype.addClient  = function (idetype,user,socket) {
    let uid = user["_id"];
    console.info(uid + ' connect socket successful');

    let product = this.assignProduct(idetype,user);
    product.addClient(uid,socket);

    socket.on('disconnect', function () {
        product.removeClient(uid);
    });

    for (let index in this.serviceConfigs) {
        let productServices = this.serviceConfigs[index];
        if (productServices.services) {
            for (let sIndex in productServices.services) {
                let service = productServices.services[sIndex];
                if (!service.id || !service.type) {
                    continue
                }
                if (service.type === 'IOService') {
                    socket.on(productServices.type + "_" + service.id, function (reqData, callback) {
                        reqData.uid = uid;
                        if (product) {
                            product.runServiceHandler(reqData, callback);
                        } else {
                            console.error('can not find consumer :' + reqData.type, reqData);
                        }
                    });
                } else if (service.type === 'localService') {
                    socket.on(productServices.type + "_" + service.id, function (reqData, callback) {
                        reqData.uid = uid;
                        service.handler.call(this,reqData,callback,product,service);
                    });
                }
            }
        }
    }

}

Servlet.prototype.assignProduct = function (idetype,user) {
    let uid = user['_id'];
    let p_u = WebIDEDB.getCollection("product_user");
    let result = p_u.findOne({uid});
    if(result){
        let p = ProductManager.getProduct(result.pid);
        if(p){
            return p;
        }
        p_u.findAndRemove({uid});
    }
    let min ;
    let selected;
    let products = ProductManager.getAllProducts();
    for(let i = 0 ; i < products.length ; i++) {
        let p = products[i];
        let pNum = p_u.count({'pid':p.id});
        if(idetype === p.name && (!selected || pNum < min)){
            min = pNum;
            selected = p;
        }
    }
    p_u.insert({
        'uid':uid,
        'pid':selected.id,
        'createTime':new Date()
    });
    return selected;
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

module.exports = Servlet