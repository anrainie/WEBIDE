/**
 * Created by zcn on 2017/8/31.
 */
module.exports  = {
    deepParseJson:function(str){
        return JSON.parse(str,function (k,v) {
            if(typeof v === 'string' && v.charAt(0) === '{' && v.charAt(v.length) === '}'){
                return JSON.parse(v);
            }
            return v;
        });
    },
    hashCode:function (str) {
        var h = 0;
        var len = str.length;
        var t = 2147483648;
        for (var i = 0; i < len; i++) {
            h = 31 * h + str.charCodeAt(i);
            if(h > 2147483647)
                h %= t;
        }
        return h;
    },
    isString : function (str) {
        return Object.prototype.toString.call(str) === "[object String]";
    }
}