/**
 * Created by zcn on 2017/6/15.
 */
var Client = require('socket.io-client');
var dbConstants = require('../constants/DBConstants');
var productDao = require('../dao/ProductDao');

class Product{
    
    constructor(socket,id,type,ip){
        this.id = id;
        this.type = type;
        this.ip = ip;
        this.socket = socket;
        this.clients = {};
    }
   

    runServiceHandler  (reqData, callback) {
        if(!this.socket.connected) {
            callback({state: "error", errorMsg:"Product is disconnected"});
        }else{
            IDE.consoleLogger.debug(`product emit ${reqData.event}`);
            let id = IDE.genUUID();
            data.reqId = id;
            this.emit(reqData.event,JSON.stringify(data));
            this.socket.once(id,(respData) => {
                IDE.consoleLogger.debug(`product emit callback successful: ${id}`);
                callback(respData);
            });
        }
    }

    emit  (eventId,reqData,callback) {
        this.socket.emit(eventId, reqData, function (respData) {
            callback(respData);
        });
    }

    /**
     *
     * @param reqData {uid:'',path:''}
     * @param callback
     */
    lockFile  (reqData,callback) {
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
    releaseFile  (reqData,callback) {
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
    peekFileLock  (reqData,callback) {
        let cb = callback;
        this.emit('peekFileLock', JSON.stringify(reqData), function (result) {
            cb(result);
        });
    }

    getClientNum  () {
        return Object.getOwnPropertyNames(this.clients).length;
    }

    addClient  (id,client) {
        this.clients[id] = client;
    }

    removeClient  (id) {
        delete this.clients[id];
    }

    getClient  (uid) {
        return this.clients[uid];
    }

    disconnect  () {
        this.socket.close();
    }

    unregister  (p) {
        productDao.delProduct({'id':this.id});
        let p_u = IDE.DB.getCollection(dbConstants.PRODUCT_USER);
        p_u.findAndRemove({id:this.id});
        IDE.ideLogger.info(`unregister product ${this.ip} -${this.type}`)
    }

}
module.exports =  Product;

