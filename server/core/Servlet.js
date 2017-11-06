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


class Servlet{

    constructor(serviceConfigs, session, http){
        this.serviceConfigs = serviceConfigs;
        this.session = session;
        this.http = http;
        this.products = [];
        this.user2product = new Map();
    }

    start () {
        var self = this;
        var server = socket_io(this.http);

        for(let i = 0 ; i < this.serviceConfigs.length; i++){
            IDE.mergeService(ideServices,this.serviceConfigs[i]);
        }

        server.use(shareSession(this.session, {
            autoSave: true
        }));

        server.use(function (socket, next) {
            let user = socket.handshake.session.user;
            let idetype = socket.handshake.query.type;
            let isServer = socket.handshake.query.server;
            if ( (isServer && idetype && idetype.length > 0 ) || user) {
                next();
            } else {
                next(new Error('nosession'));
            }
        });

        server.on('connection', function (socket) {
            let user = socket.handshake.session.user;
            let idetype = socket.handshake.query.type;
            let isServer = socket.handshake.query.server;
            if(isServer) {
                if(idetype && idetype.length > 0) {
                    let id = socket.handshake.query.id;
                    let ip = socket.handshake.address;
                    let product = new Product(socket, id, idetype, ip);
                    self.addProduct(product);
                }else{
                    IDE.ideLogger.error(`Product type can not be null`);
                }
            }else{
                self.addClient(idetype, user, socket);
            }
        });
    }

    addProduct(product) {
        this.products.push(product);

        IDE.ideLogger.info(`Product ${product.ip} - ${product.type} is connected`);

        product.socket.on('disconnect',() => {
            this.products.every((value,index) => {
                if(value === product){
                    this.products.splice(index,1);
                    return false;
                }
                return true;
            });

            let clients = product.clients;
            var uids = Object.getOwnPropertyNames(clients);
            uids.forEach( (v,k) => {
                this.user2product.delete(k);
            });

            product.disconnect();

            IDE.ideLogger.info(`Product ${product.ip} - ${product.type} is disconnected`);
        });

    }

    addClient (idetype,user,socket) {
        let uid = user["id"];
        IDE.defaultLogger.info(uid + ' connect socket successful');

        let product = this.assignProduct(idetype,user);
        if(product){
            product.addClient(uid,socket);
            this.user2product.set(uid,product);
        }

        socket.on('disconnect', ()=> {
            if(product) {
                product.removeClient(uid);
                this.user2product.delete(uid);
            }
        });

        let services = this.getService(idetype);
        if(services) {
            services.services.forEach((service, index) => {
                if (service.id && service.type) {
                    if (service.type === 'IOService') {
                        socket.on(idetype + "_" + service.id, (reqData, callback) => {
                            reqData.uid = uid;
                            let p = this.user2product.get(uid);
                            if (p) {
                                p.runHandler(service.handler,reqData, callback);
                            } else {
                                callback({state: 'error', errorMsg: 'can not find product :' + reqData.type, reqData});
                            }
                        });
                    } else if (service.type === 'localService') {
                        socket.on(idetype + "_" + service.id, (reqData, callback) => {
                            reqData.uid = uid;
                            let p = this.user2product.get(uid);
                            service.handler.call(this, reqData, callback, p, service);
                        });
                    }
                }
            });
        }
    }

    assignProduct (idetype,user) {
        let uid = user['_id'];
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
        let selected;
        let products = this.getAllProducts();
        for(let i = 0 ; i < products.length ; i++) {
            let p = products[i];
            let pNum = p_u.count({'pid':p.id});
            if(idetype === p.type && (!selected || pNum < min)){
                min = pNum;
                selected = p;
            }
        }
        if(selected) {
            p_u.insert({
                'uid': uid,
                'pid': selected.id,
                'createTime': new Date()
            });
        }
        return selected;
    }

    getProduct (id) {
        for(let i = 0 ; i < this.products.length ; i++){
            if(this.products[i].id === id){
                return this.products[i];
            }
        }
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
        for(let i = 0 ; i < this.products.length ; i++){
            if(this.products[i].id === id){
                this.products.splice(i ,1);
                break;
            }
        }
    }

    unregisterProduct (p) {
        p.disconnect();
        p.unregister();
    }
}

module.exports = Servlet