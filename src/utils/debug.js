/**
 * Created by zcn on 2017/7/6.
 */
module.exports  = {
    error:function (msg) {
        console.error("[WEBIDE ERROE] " + getDataStr() + " : " + msg);
    },
    info:function (msg) {
        console.info("[WEBIDE INFO] " + getDataStr() + " : " + msg);
    }
}

function getDataStr() {
    var date = new Date();
    var month = replenish(date.getMonth() + 1);
    var dateStr = replenish(date.getDate());
    var hour = replenish(date.getHours());
    var minute = replenish(date.getMinutes());
    var second = replenish(date.getSeconds());

    return date.getFullYear() + "-" + month + "-" + dateStr
        + " " + hour + ":" + minute + ":" + second;
}

function replenish(i){
    if (i >= 1 && i <= 9) {
        i = "0" + i;
    }
    return i;
}