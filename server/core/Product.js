/**
 * Created by zcn on 2017/6/15.
 */
const dbConstants = require('../constants/DBConstants');
const productDao = require('../dao/ProductDao');
const timeout = 10 * 1000;

class Product{
    
    constructor(socket,id,type,ip){
        this.id = id;
        this.type = type;
        this.ip = ip;
        this.socket = socket;
        this.clients = {};
    }

    runHandler(handler,reqData,callback) {
        handler.call(this,reqData,callback);
    }

    emit(eventId,reqData,callback) {
        if(!this.socket.connected && callback) {
            callback({state: "error", errorMsg:"Product is disconnected"});
        }else {
            let callbackId = IDE.genUUID();
            let callbackSuccess = false;
            reqData.reqId = callbackId;

            IDE.consoleLogger.debug(`product emit ${reqData.event}`);
            this.socket.emit(eventId, reqData);

            if (callback) {
                this.socket.once(callbackId, (respData) => {
                    callbackSuccess = true;
                    callback(respData);

                    IDE.consoleLogger.debug(`product emit ${eventId} ,callback successful ${callbackId}`);
                });
                setTimeout(() => {
                    if (!callbackSuccess) {
                        this.socket.off(callbackId);
                        callback({state: "error", errorMsg: "callback timeout"});

                        IDE.consoleLogger.error(`product emit ${eventId} ,callback timeout ${callbackId}`);
                    }
                }, timeout);
            }
        }
    }

    /**
     *
     * @param reqData {uid:'',path:''}
     * @param callback
     */
    lockFile (reqData,callback) {
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
    releaseFile (reqData,callback) {
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
    peekFileLock (reqData,callback) {
        let cb = callback;
        this.emit('peekFileLock', JSON.stringify(reqData), function (result) {
            cb(result);
        });
    }

    getClientNum () {
        return Object.getOwnPropertyNames(this.clients).length;
    }

    addClient (id,client) {
        this.clients[id] = client;
    }

    removeClient (id) {
        delete this.clients[id];
    }

    getClient (uid) {
        return this.clients[uid];
    }

    disconnect() {
        this.socket.disconnect(true)
    }

    unregister(p) {
        productDao.delProduct({'id':this.id});
        let p_u = IDE.DB.getCollection(dbConstants.PRODUCT_USER);
        p_u.findAndRemove({id:this.id});
        IDE.ideLogger.info(`unregister product ${this.ip} - ${this.type}`)
    }

}
module.exports =  Product;

