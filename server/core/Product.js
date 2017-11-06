/**
 * Created by zcn on 2017/6/15.
 */
var Client = require('socket.io-client');
var dbConstants = require('../constants/DBConstants');
var productDao = require('../dao/ProductDao');

function Product(socket,id,type,ip) {
    this.id = id;
    this.type = type;
    this.ip = ip;
    this.socket = socket;
    this.clients = {};
}

Product.prototype.runServiceHandler = function (reqData, callback) {
    if(!this.socket.connected) {
        callback({state: "error", errorMsg:"Product is disconnected"});
    }else{
        IDE.consoleLogger.debug(`product emit ${reqData.event}`);
        this.emit(reqData.event,JSON.stringify(data),(respData) => {
            IDE.consoleLogger.debug(`product emit callback successful: ${reqData.event}`);
            callback(respData);
        });
    }
}

Product.prototype.emit = function (eventId,reqData,callback) {
    this.socket.emit(eventId, reqData, function (respData) {
        callback(respData);
    });
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

Product.prototype.disconnect = function () {
    this.socket.close();
}

Product.prototype.unregister = function (p) {
    productDao.delProduct({'id':this.id});
    let p_u = IDE.DB.getCollection(dbConstants.PRODUCT_USER);
    p_u.findAndRemove({id:this.id});
    IDE.ideLogger.info(`unregister product ${this.ip} -${this.type}`)
}

module.exports =  Product;

