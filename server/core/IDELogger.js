/**
 * Created by zcn on 2017/10/25.
 */
function IDELogger(level){
    this.level = level;
    this.log4js = require('log4js');
    this.log4js.configure({
        appenders: {
            ideLogs: { type: 'dateFile', filename: 'logs/ide.log' ,"pattern": "-yyyy-MM-dd", "alwaysIncludePattern": true},
            console: { type: 'console' }
        },
        categories: {
            ide: { appenders: ['ideLogs'], level: this.level },
            console: { appenders: ['console'], level: this.level },
            default: { appenders: ['console', 'ideLogs'], level: this.level }
        }
    });
}

IDELogger.prototype.getDefault = function(){
    return this.log4js.getLogger();
}

IDELogger.prototype.getConsole = function(){
    return this.log4js.getLogger("console");
}

IDELogger.prototype.getIDE = function(){
    return this.log4js.getLogger("ide");
}

module.exports = IDELogger;
