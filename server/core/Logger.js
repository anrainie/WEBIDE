/**
 * Created by zcn on 2017/10/25.
 */
var log4js = require("log4js");
function Logger(level){
console.info('level',level);
    this.level = level;
    this.log4js = require('log4js');
    log4js.configure({
      appenders: {
        ideLogs: { type: 'dateFile', filename: 'logs/ide.log' ,"pattern": "-yyyy-MM-dd", "alwaysIncludePattern": true},
        console: { type: 'console' }
      },
      categories: {
        ide: { appenders: ['ideLogs'], level: this.level },
        another: { appenders: ['console'], level: this.level },
        default: { appenders: ['console', 'ideLogs'], level: this.level }
      }
    });
}

Logger.prototype.getDefault = function(){
    return this.log4js.getLogger();
}

Logger.prototype.getConsole = function(){
    return this.log4js.getLogger("console");
}

Logger.prototype.getIDE = function(){
    return this.log4js.getLogger("ide");
}

module.exports = Logger;
