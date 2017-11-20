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
    Q.all([this.initLogger(), this.initDBAndServlet()]).then(() => {
        callback();
    }, err => {
        callback(err);
    });
}

IDE.prototype.initLogger = function () {
    let def = Q.defer();
    this.logger = new IDELogger(this.config.logLevel);
    this.cfLogger = this.logger.getDefault();
    this.consoleLogger = this.logger.getConsole();
    this.fileLogger = this.logger.getIDE();
    def.resolve();
    return def.promise;
}

IDE.prototype.initDBAndServlet = function () {
    let def = Q.defer();

    this.DB = new WebIDEDB({dbpath: 'webide.db'});
    let dfd = this.DB.start();
    dfd.done(() => {
        this.cfLogger.info("Database init successfully");

        //init collections
        this.DB.getOrCreateCollection(dbConstants.USER);
        this.DB.getOrCreateCollection(dbConstants.PRODUCT_USER);
        this.DB.getOrCreateCollection(dbConstants.PRODUCT);

        this.Servlet = new Servlet([afaServices, afeServices], this.session, this.http);
        this.Servlet.start();

        this.cfLogger.info("Servlet init successfully");

        def.resolve();
    }, (err) => {
        throw new Error("load loki database error");
    });
    return def.promise;
}

module.exports = IDE