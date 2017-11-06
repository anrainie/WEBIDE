const dbConstants = require('../constants/DBConstants');
const WebIDEDB = require('../db/WebIDEDB');
const IDELogger = require('../core/IDELogger');
const Servlet = require('./Servlet');
const afaServices = require('../service/afa.service');
const afeServices = require('../service/afe.service');
const Q = require('Q');

function IDE(config, http, session) {
    this.config = config;
    this.http = http;
    this.session = session;
}

IDE.prototype.init = function (callback) {

    Q.all([this.initLogger(),this.initDBAndServlet()]).then(function(){
        callback();
    });
}

IDE.prototype.initLogger = function () {
    let def = Q.defer();
    this.logger = new IDELogger(this.config.logLevel);
    this.defaultLogger = this.logger.getDefault();
    this.consoleLogger = this.logger.getConsole();
    this.ideLogger = this.logger.getIDE();
    def.resolve();
    return def.promise;
}


IDE.prototype.initDBAndServlet = function () {
    let def = Q.defer();

    this.DB = new WebIDEDB({dbpath: 'webide.db'});
    let dfd = this.DB.start();
    dfd.done(() => {
        this.defaultLogger.info("Database init successfully");

        //init collections
        this.DB.getOrCreateCollection(dbConstants.USER);
        this.DB.getOrCreateCollection(dbConstants.PRODUCT_USER);
        this.DB.getOrCreateCollection(dbConstants.PRODUCT);

        this.Servlet = new Servlet([afaServices, afeServices], this.session, this.http);
        this.Servlet.start();

        this.defaultLogger.info("Servlet init successfully");

        def.resolve();
    }, (err) => {
        throw new Error("load loki database error");
    });
    return def.promise;
}


IDE.prototype.genUUID = function () {
    var len = 32;//32长度
    var radix = 16;//16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

IDE.prototype.mergeService = function (source, target) {
    let s_services = source.services;
    let t_services = target.services;
    let services = {};
    for (let i = 0; i < t_services.length; i++) {
        let service = t_services[i];
        services[service.id] = null;
    }
    for (let i = 0; i < s_services.length; i++) {
        let service = s_services[i];
        if (!(service.id in services)) {
            t_services.push(service);
        }
    }
}

module.exports = IDE