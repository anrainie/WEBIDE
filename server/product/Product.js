/**
 * Created by zcn on 2017/6/15.
 */
var Client = require('socket.io-client');

function Product(name,ip,port,serviceConfig) {
    this.name = name;
    this.ip = ip;
    this.port = port;
    this.serviceConfig = serviceConfig;
    this.services = {};
    this.socket = null;
    this.online = false;

}

Product.prototype.connect = function () {
    var self = this;
    this.socket = Client("http://" + this.ip + ":" + this.port);

    this.socket.on('connect',function () {
        self.online = true;
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " connect success");
        if(!self.inited && self.serviceConfig.services){
            for(let key in self.serviceConfig.services){
                self.registerService(self.serviceConfig.services[key]);
            }
            self.inited = true;
        }
        self.socket.emit("getNaviItems","{'type':'afa','event':'getNaviItems','data':{'path':'\\\\','level':1}}",function (data) {
            console.info('====IDE链接初始化====');
        });
    });

    this.socket.on('connect_failed',function () {
        self.online = false;
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " connect failed");
    });

    this.socket.on('disconnect',function () {
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " disconnect");
    })

    this.socket.on('reconnect_failed',function () {
        self.online = false;
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " reconnect_failed");
    });

    this.socket.on('reconnect',function (data) {
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " reconnect");
    })


}

Product.prototype.runHandler = function (reqData,callback) {
    let handler = this.services[reqData.event];

    if(!this.socket.connected) {
        callback(JSON.stringify({"state": "error", "errorMsg": "ide socket is off line"}));
    }else{
        if (!handler) {
            callback(JSON.stringify({"state": "error", "returnMsg": "service is unregisted"}));
        } else {
            let data = JSON.stringify(reqData);
            handler(reqData.event, data, this.socket, function (rspData) {
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


Product.prototype.disconnect = function () {
    //TODO
}




module.exports =  Product;

