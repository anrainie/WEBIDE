/**
 * Created by zcn on 2017/6/15.
 */
var Client = require('socket.io-client');
var dbConstants = require('../constants/DBConstants');
var productDao = require('../dao/ProductDao');

function Product(id,type,ip,port,serviceConfig) {
    this.id = id;
    this.type = type;
    this.ip = ip;
    this.port = port;
    this.serviceConfig = serviceConfig;
    this.services = {};
    this.socket = null;
    this.clients = {};
    this.online = false;
}

Product.prototype.connect = function () {
    var self = this;
    var url = "http://" + this.ip + ":" + this.port +"?" + "type=" + this.type;
    this.socket = Client(url,{
        reconnectionAttempts:20
    });

    this.socket.on('connect',function () {
        self.online = true;

        IDE.defaultLogger.info(`${self.ip}:${self.port}-${self.type} connect successfully`);

        if(!self.initialized) {
            self.initialized = true;

            if (self.serviceConfig.services) {
                for (let key in self.serviceConfig.services) {
                    self.registerService(self.serviceConfig.services[key]);
                }
            }

            self.socket.emit("ready",null,function (data) {
                IDE.defaultLogger.info(`socket ${self.ip}:${self.port}-${self.type} connect successfully`);
            });

        }

    });

    this.socket.on('connect_failed',function () {
        self.online = false;
        IDE.defaultLogger.info(`product ${self.ip}:${self.port}-${self.type} connect failed`);
    });

    this.socket.on('connect_timeout',function () {
        self.online = false;
        IDE.defaultLogger.info(`product ${self.ip}:${self.port}-${self.type} connect timeout`);
    });

    this.socket.on('disconnect',function () {
        IDE.defaultLogger.info(`product ${self.ip}:${self.port}-${self.type} disconnect`);
    })

    this.socket.on('reconnect',function (data) {
        IDE.defaultLogger.info(`product ${self.ip}:${self.port}-${self.type} reconnect`);
        IDE.defaultLogger.info(`product ${self.ip}:${self.port}-${self.type} reconnect`);
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
        callback({state: "error", errorMsg:"ide socket is off line"});
    }else{
        if (!handler) {
            callback({state: "error", returnMsg: "service is unregisted"});
        } else {
            handler.call(this,reqData,function (rspData) {
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
            IDE.ideLogger.error('service id can not be null');
            return;
        }
        if(!service.handler){
            IDE.ideLogger.error('service handler can not be null');
            return;
        }
        if(service.type === 'IOService') {
            this.services[service.id] = service.handler;
        }
    }else{
        IDE.ideLogger.error(`Product ${this.ip}:${this.port}-${this.port} is offline`);
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

Product.prototype.shutdown = function () {
    this.online = false;
    this.socket.close();
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

Product.prototype.unregister = function (p) {
    productDao.delProduct({'id':this.id});
    let p_u = IDE.DB.getCollection(dbConstants.PRODUCT_USER);
    p_u.findAndRemove({id:this.id});

    IDE.ideLogger.info(`unregister product ${this.ip}:${this.port}-${this.type}`)
}

module.exports =  Product;

