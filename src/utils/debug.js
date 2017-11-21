/**
 * Created by zcn on 2017/7/6.
 */
function debug() {
}
debug.prototype.enabled = enable();
debug.prototype.error = function (msg) {
    if (this.enabled) {
        console.error("[WEBIDE ERROE] " + getDataStr() + " : " + msg);
    }
}
debug.prototype.info = function (msg) {
    if (this.enabled) {
        console.info("[WEBIDE INFO] " + getDataStr() + " : " + msg);
    }
}

function enable() {
    return true;
}

function getDataStr() {
    var date = new Date();
    var month = replenish(date.getMonth() + 1);
    var dateStr = replenish(date.getDate());
    var hour = replenish(date.getHours());
    var minute = replenish(date.getMinutes());
    var second = replenish(date.getSeconds());

    return date.getFullYear() + "-" + month + "-" + dateStr   + " " + hour + ":" + minute + ":" + second;
}

function replenish(i) {
    if (i >= 1 && i <= 9) {
        i = "0" + i;
    }
    return i;
}

module.exports = function createDebug() {
    return new debug();
}

