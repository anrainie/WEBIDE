/**
 * Created by zcn on 2017/6/15.
 */

var socket_io = require('socket.io');
var parseCookie = require('cookie-parser')
var shareSession = require('express-socket.io-session')
var dbConstants = require('./constants/DBConstants')
var productDao = require('./dao/ProductDao');
var Product = require('./product/Product')

function Servlet(serviceConfigs, session, http) {
    this.serviceConfigs = serviceConfigs;
    this.session = session;
    this.http = http;
    this.products = [];
}

Servlet.prototype.start = function () {
    var self = this;
    var server = socket_io(this.http);

    server.use(shareSession(this.session, {
        autoSave: true
    }));

    server.use(function (socket, next) {
        var user = socket.handshake.session.user;
        if (user) {
            // 用户已登录则允许连接socket
            next();
        } else {
            next(new Error('nosession'));
        }
    });

    let products =  productDao.getAllProducts();
    for(var i = 0; i < products.length;i ++){
        let p = products[i];
        this.registerProduct(p);
    }

    server.on('connection', function (socket) {
        let user = socket.handshake.session.user;
        let idetype = socket.handshake.query.type;
        self.addClient(idetype,user,socket);
    });
}

Servlet.prototype.registerProduct = function (p) {
    let service = this.getService(p.type);
    let product = new Product(p.id,p.type,p.ip,p.port,service);
    product.connect();
    this.products.push(product);
}

Servlet.prototype.updateProduct = function (newProduct) {
    let product = this.getProduct(newProduct.id);
    product.type = newProduct.type;
    product.ip = newProduct.ip;
    product.port = newProduct.port;
    product.shutdown();
    product.connect();
}

Servlet.prototype.unregisterProduct = function (p) {
    p.shutdown();
    p.unregister();
}

Servlet.prototype.addClient  = function (idetype,user,socket) {
    let uid = user["_id"];
    console.info(uid + ' connect socket successful');

    let product = this.assignProduct(idetype,user);
    if(product){
        product.addClient(uid,socket);
    }

    socket.on('disconnect', function () {
        if(product) {
            product.removeClient(uid);
        }
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
                            callback({state:'error',errorMsg:'can not find consumer :' + reqData.type, reqData});
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
    let p_u = IDE.DB.getCollection("product_user");
    let db_pu = p_u.find({uid});
    if(db_pu && db_pu.length > 0){
        for(let i = 0 ; i < db_pu.length ; i ++){
            let p = this.getProduct(db_pu[i].pid);
            if(p && p.type === idetype){
                return p;
            }
        }
    }

    let min ;
    let selected;
    let products = this.getAllProducts();
    for(let i = 0 ; i < products.length ; i++) {
        let p = products[i];
        let pNum = p_u.count({'pid':p.id});
        if(idetype === p.type && (!selected || pNum < min)){
            min = pNum;
            selected = p;
        }
    }
    if(selected) {
        p_u.insert({
            'uid': uid,
            'pid': selected.id,
            'createTime': new Date()
        });
    }
    return selected;
}

Servlet.prototype.getProduct = function (id) {
    for(let i = 0 ; i < this.products.length ; i++){
        if(this.products[i].id === id){
            return this.products[i];
        }
    }
    return null;
}

Servlet.prototype.getService = function (type) {
    for(var j = 0 ; j < this.serviceConfigs.length ; j++){
        if(this.serviceConfigs[j].type === type){
            return this.serviceConfigs[j];
        }
    }
    return null;
}

Servlet.prototype.getAllProducts = function () {
    return this.products;
}

Servlet.prototype.removeProduct = function (id) {
    for(let i = 0 ; i < this.products.length ; i++){
        if(this.products[i].id === id){
            this.products.splice(i ,1);
            break;
        }
    }
}

module.exports = Servlet