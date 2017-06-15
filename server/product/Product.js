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
    this.socket = Client.connect("http://" + this.ip + ":" + this.port);

    this.socket.on('connect',function () {
        self.online = true;
        if(self.serviceConfig.services){
            for(let key in self.serviceConfig.services){
                self.registerService(self.serviceConfig.services[key]);
            }
        }
    });

    this.socket.on('connect_failed',function () {
        self.online = false;
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + "connect failed");
    });

    this.socket.on('disconnect',function () {
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + " disconnect");
    })

    this.socket.on('reconnect_failed',function () {
        self.online = false;
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + "reconnect_failed");
    });

    this.socket.on('reconnect',function () {
        self.online = true;
        console.info("product:" + self.name + " ip:" + self.ip + ' port:' + self.port + "reconnect");
    })


}

Product.prototype.runHandler = function (reqData,callback) {
    let service = this.services[reqData.service];
    if (service == null || service == undefined) {
        callback({returnCode: 'error', returnMsg: 'The service has not been register!'});
    } else {
        service.handle(reqData.service,reqData,this.socket, function (err, rspData) {
            if (err) {
                callback({returnCode: 'error', returnMsg: err});
            } else {
                callback({returnCode: 'success', data: rspData});
            }
        });
    }
}

Product.prototype.registerService = function (service) {
    if(this.online){
        let id = service.id;
        let handler = service.handler;
        if(service.id){
            console.info('service id can not be null');
            return;
        }
        if(service.handler){
            console.info('service handler can not be null');
            return;
        }
        this.services[service.id] = new serviceHandler();
    }else{
        console.info('product is offline,' + 'name:' + this.name + ' ip:' + this.ip + ' port:' + this.port);
    }
}


Product.prototype.disconnect = function () {
    //TODO
}




module.exports =  Product;

