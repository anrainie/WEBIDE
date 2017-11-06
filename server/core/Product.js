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
        this.clients = new Map();
        this.config();
    }

    config(){
        this.socket.on('lockTimeout',(timeoutlocks) => {
            if(timeoutlocks.length > 0) {
                let filelock = WebIDEDB.getCollection(dbConstants.filelock);
                for (let i = 0; i < timeoutlocks.length; i++) {
                    let lock = timeoutlocks[i];
                    let query = {pid: self.id, file: lock.path};
                    let localLock = filelock.findOne(query);
                    if(localLock) {
                        filelock.findAndRemove(query);
                        let client = this.clients.get(localLock.uid);
                        if(client){
                            client.emit('lockTimeout',lock.path);
                        }
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
            let callbackId = IDE.genUUID();
            let callbackSuccess = false;
            reqData.callbackId = callbackId;

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
        IDE.ideLogger.info(`clear product ${this.ip} - ${this.type}`)
    }

}
module.exports =  Product;

