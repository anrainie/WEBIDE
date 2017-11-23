/**
 * Created by zcn on 2017/6/15.
 */

const socket_io = require('socket.io');
const parseCookie = require('cookie-parser');
const shareSession = require('express-socket.io-session');
const dbConstants = require('./../constants/DBConstants');
const productDao = require('./../dao/ProductDao');
const Product = require('./Product');
const ideServices = require('./../service/ide.service.js');
const tools = require('../utils/tools')

class Servlet{

    constructor(serviceConfigs, session, http){
        this.serviceConfigs = serviceConfigs;
        this.session = session;
        this.http = http;
        this.products = new Map();
        this.user2product = new Map();
    }

    start () {
        var self = this;
        var server = socket_io(this.http);

        for(let i = 0 ; i < this.serviceConfigs.length; i++){
            tools.mergeService(ideServices,this.serviceConfigs[i]);
        }

        server.use(shareSession(this.session, {
            autoSave: true
        }));

        server.use(function (socket, next) {
            let user = socket.handshake.session.user;
            let idetype = socket.handshake.query.type;
            let isServer = socket.handshake.query.server;
            if ( (isServer === 'true' && idetype && idetype.length > 0 ) || user) {
                next();
            } else {
                return next(new Error('can not connect socket because nosession'));
            }
        });

        server.on('connection', (socket) => {
            let user = socket.handshake.session.user;
            let idetype = socket.handshake.query.type;
            let isServer = socket.handshake.query.server;
            if(isServer) {
                let ip = socket.handshake.address;
                let id = socket.handshake.query.id;
                if(idetype && idetype.length > 0) {
                    let product = new Product(socket, id, idetype, ip);
                    self.addProduct(product);
                }else{
                    IDE.fileLogger.error(`Product type can not be null,address ${ip}`);
                }
            }else{
                IDE.cfLogger.info(user['id'] + ' connect socket successful');
                self.addClient(idetype, user, socket);
            }
        });
    }

    addProduct(product) {
        if(this.getProduct(product.id)) {
            IDE.fileLogger.error(`Already has same product : ${product.id}`);
            return;
        }
        this.products.set(product.id,product);

        IDE.cfLogger.info(`Product ${product.ip} - ${product.type} is connected`);

        product.socket.on('disconnect',() => {
            this.removeProduct(product.id);
            let clients = product.clients;
            for (var [key, value] of clients) {
                this.user2product.delete(key);
            }
            product.disconnect();

            IDE.cfLogger.info(`Product ${product.ip} - ${product.type} is disconnected`);
        });

    }

    addClient (idetype,user,userSocket) {
        let uid = user["id"];
        this.assignProduct(idetype,user,userSocket);
        let services = this.getService(idetype);
        if(services) {
            services.services.forEach((service, index) => {
                if (service.id && service.type) {
                    userSocket.on(idetype + "_" + service.id, (reqData, callback) => {
                        reqData.uid = uid;
                        let pid = this.user2product.get(uid)
                        let product;
                        if (pid) {
                            product = this.getProduct(pid);
                            if(!product){
                                callback({state: 'error', errorMsg: 'can not find product :' + reqData.type, reqData});
                                return;
                            }
                        } else {
                            //reassign product
                            //TODO 如果多次没找到加入黑名单
                            product = this.assignProduct(idetype,user,userSocket);
                        }

                        if(product) {
                            if (service.type === 'IOService') {
                                product.runHandler(service.handler, reqData, callback);
                            }else if (service.type === 'localService'){
                                service.handler.call(this, reqData, callback, product, service);
                            }
                        }else{
                            callback({state: 'error', errorMsg: 'user has not been assigned a product or product is disconnected:' + reqData.type, reqData});
                        }
                    });
                }
            });
        }
    }

    assignProduct (idetype,user,userSocket) {
        let uid = user.id;
        let product = this.findProduct(idetype,user);
        if(product){
            product.addClient(uid,userSocket);
            this.user2product.set(uid,product.id);

            userSocket.on('disconnect', ()=> {
                product.removeClient(uid);
                this.user2product.delete(uid);
            });
        }
        return product;
    }

    findProduct(idetype,user){
        let uid = user['id'];
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
        let selectedProject;
        for(let p in this.products.values()) {
            let pNum = p_u.count({'pid':p.id});
            if(idetype === p.type && (!selectedProject || pNum < min)){
                min = pNum;
                selectedProject = p;
            }
        }
        if(selectedProject) {
            p_u.insert({
                'uid': uid,
                'pid': selectedProject.id,
                'ideType':selectedProject.type,
                'createTime': new Date()
            });
        }
        return selectedProject;
    }

    getProduct (id) {
        return this.products.get(id);
    }

    getService (type) {
        for(var j = 0 ; j < this.serviceConfigs.length ; j++){
            if(this.serviceConfigs[j].type === type){
                return this.serviceConfigs[j];
            }
        }
    }

    getAllProducts () {
        return this.products;
    }

    removeProduct (id) {
       this.products.delete(id);
    }

    clearProduct (p) {
        p.clear();
    }
}

module.exports = Servlet