/**
 * Created by zcn on 2017/6/15.
 */
var Client = require('socket.io-client');
var dbConstants = require('../constants/DBConstants');

function Product(id,name,ip,port,serviceConfig) {
    this.id = id;
    this.name = name;
    this.ip = ip;
    this.port = port;
    this.serviceConfig = serviceConfig;
    this.services = {};
    this.socket = null;
    this.clients = {};
    this.online = false;
}

/**
 * 注册产品，写入数据库
 */
Product.prototype.register = function () {
    let product = WebIDEDB.getCollection(dbConstants.product);
    product.insert({
        id:this.id,
        name:this.name,
        ip:this.ip,
        port:this.port,
        createTime:new Date()
    });
}

Product.prototype.connect = function () {
    var self = this;
    var url = "http://" + this.ip + ":" + this.port +"?" + "type=" + this.name;
    this.socket = Client(url,{
        reconnectionAttempts:20
    });

    this.socket.on('connect',function () {
        self.online = true;

        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " connect success");

        if(!self.initialized) {
            self.initialized = true;

            if (self.serviceConfig.services) {
                for (let key in self.serviceConfig.services) {
                    self.registerService(self.serviceConfig.services[key]);
                }
            }

            self.socket.emit("ready",null,function (data) {
                console.info('====IDE链接初始化====');
            });

        }

    });

    this.socket.on('connect_failed',function () {
        self.online = false;
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " connect failed");
    });

    this.socket.on('connect_timeout',function () {
        self.online = false;
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " connect timeout");
    });

    this.socket.on('disconnect',function () {
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " disconnect");
    })

    this.socket.on('reconnect',function (data) {
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " reconnect");
    });

    this.socket.on('lockTimeout',function (timeoutlock) {
        if(timeoutlock.length > 0) {
            for (let i = 0; i < timeoutlock.length; i++) {
                let lock = timeoutlock[i];
                let client = self.getClient(lock.uid);
                if(client){
                    client.emit('lockTimeout',lock.path);
                }
            }
        }
    });

}

Product.prototype.runServiceHandler = function (reqData, callback) {
    let handler = this.services[reqData.event];
    if(!this.socket.connected) {
        callback(JSON.stringify({"state": "error", "errorMsg": "ide socket is off line"}));
    }else{
        if (!handler) {
            callback(JSON.stringify({"state": "error", "returnMsg": "service is unregisted"}));
        } else {
            handler.call(this,reqData.event,reqData,function (rspData) {
                callback(rspData);
            });
        }
    }
}

Product.prototype.emit = function (eventId,reqData,callback) {
    this.socket.emit(eventId, reqData, function (respData) {
        callback(respData);
    });
}

Product.prototype.registerService = function (service) {
    if(this.online){
        let id = service.id;
        let handler = service.handler;
        if(!service.id){
            console.info('service id can not be null');
            return;
        }
        if(!service.handler){
            console.info('service handler can not be null');
            return;
        }
        if(service.type === 'IOService') {
            this.services[service.id] = service.handler;
        }
    }else{
        console.info('product is offline,' + 'name:' + this.name + ' ip:' + this.ip + ' port:' + this.port);
    }
}

/**
 *
 * @param reqData {uid:'',path:''}
 * @param callback
 */
Product.prototype.lockFile = function (reqData,callback) {
    let self = this;
    let data = reqData.data;
    let cb = callback;
    this.emit("lockFile", JSON.stringify(reqData), function (respData) {
        cb(respData);
    });
}

/**
 *
 * @param reqData {uid:'',path:''}
 * @param callback
 */
Product.prototype.releaseFile = function (reqData,callback) {
    let self = this;
    let cb = callback;
    let data = reqData.data;
    this.emit('releaseFilelock', JSON.stringify(reqData), function (result) {
        cb(result);
    });
}

/**
 *
 * @param reqData {path:''}
 * @param callback
 */
Product.prototype.peekFileLock = function (reqData,callback) {
    let cb = callback;
    this.emit('peekFileLock', JSON.stringify(reqData), function (result) {
        cb(result);
    });
}

Product.prototype.unregister = function () {
    let ps = WebIDEDB.getCollection(dbConstants.product);
    ps.findAndRemove({id:this.id});

    let p_u = WebIDEDB.getCollection(dbConstants.PRODUCT_USER);
    p_u.findAndRemove({id:this.id});
}

Product.prototype.getClientNum = function () {
    return Object.getOwnPropertyNames(this.clients).length;
}

Product.prototype.addClient = function (id,client) {
    this.clients[id] = client;
}

Product.prototype.removeClient = function (id) {
    delete this.clients[id];
}

Product.prototype.getClient = function (uid) {
    return this.clients[uid];
}


module.exports =  Product;

