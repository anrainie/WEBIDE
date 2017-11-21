/**
 * Created by zcn on 2017/6/15.
 */
const dbConstants = require('../constants/DBConstants');
const productDao = require('../dao/ProductDao');
const tools = require('../utils/tools');

class Product{
    
    constructor(socket,id,type,ip){
        this.id = id;
        this.type = type;
        this.ip = ip;
        this.socket = socket;
        this.clients = new Map();
        this.config();
    }

    config(){
        this.socket.on('lockTimeout',(timeoutlocks) => {
            if(timeoutlocks.length > 0) {
                for (let i = 0; i < timeoutlocks.length; i++) {
                    let lock = timeoutlocks[i];
                    let client = this.getClient(lock.uid);
                    if(client){
                        client.emit('lockTimeout',lock.path);
                    }
                }
            }
        });
    }

    runHandler(handler,reqData,callback) {
        handler.call(this,reqData,callback);
    }

    emit(eventId,reqData,callback) {
        if(!this.socket.connected && callback) {
            callback({state: "error", errorMsg:"Product is disconnected"});
        }else {
            let callbackId = reqData.callbackId = tools.genUUID(),
                callbackSuccess = false,
                timeout = reqData.timeout,
                frontEmitTime = reqData.emitTime,
                newTimeout = timeout - (new Date().getTime() - frontEmitTime);

            this.socket.emit(eventId, reqData);

            IDE.consoleLogger.debug(`product emit ${reqData.event}`);

            if (callback) {
                let cb = (respData) => {
                    callbackSuccess = true;
                    callback(respData);

                    IDE.consoleLogger.debug(`product emit ${eventId} ,callback successful ${callbackId}`);
                }
                this.socket.once(callbackId, cb);
                setTimeout(() => {
                    if (!callbackSuccess) {
                        this.socket.removeListener(callbackId,cb);
                        callback({state: "error", errorMsg: "Product callback timeout"});

                        IDE.consoleLogger.error(`product emit ${eventId} ,but callback timeout ${callbackId}`);
                    }
                }, newTimeout);
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
        this.emit("lockFile", reqData, function (respData) {
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
        this.emit('releaseFilelock', reqData, function (result) {
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
        this.emit('peekFileLock', reqData, function (result) {
            cb(result);
        });
    }

    getClientNum () {
        return this.clients.size;
    }

    addClient (id,client) {
        this.clients.set(id,client);
    }

    removeClient (id) {
        delete this.clients.delete(id);
    }

    getClient (id) {
        return this.clients.get(id);
    }

    disconnect() {
        this.socket.disconnect(true)
    }

    clear() {
        let p_u = IDE.DB.getCollection(dbConstants.PRODUCT_USER);
        p_u.findAndRemove({id:this.id});
        IDE.fileLogger.info(`clear product ${this.ip} - ${this.type}`)
    }

}
module.exports =  Product;

