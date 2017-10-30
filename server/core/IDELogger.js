/**
 * Created by zcn on 2017/10/25.
 */
const log4js = require('log4js');
class IDELogger{
    constructor(level){
        this.level = level;
        this.log4js = require('log4js');
        this.log4js.configure({
            appenders: {
                ideLogs: { type: 'dateFile', filename: 'logs/IDE' ,"pattern": "_yyyy-MM-dd.log", "alwaysIncludePattern": true},
                console: { type: 'console' }
            },
            categories: {
                ide: { appenders: ['ideLogs'], level: this.level },
                console: { appenders: ['console'], level: this.level },
                default: { appenders: ['console', 'ideLogs'], level: this.level }
            }
        });
    }

    getDefault(){
        return this.log4js.getLogger();
    }

    getConsole(){
        return this.log4js.getLogger("console");
    }

    getIDE(){
        return this.log4js.getLogger("ide");
    }

    connectLogger(logger,option){
       return log4js.connectLogger(logger,option);
    }
}
module.exports = IDELogger;
