/**
 * Created by zcn on 2017/8/31.
 */

/**
 * Java关键字列表
 */
const JAVA_KEYWORD_LIST = [ "abstract", "assert",
    "boolean", "break", "byte", "case", "catch", "char", "class",
    "const", "continue", "default", "do", "double", "else", "enum",
    "extends", "final", "finally", "float", "for", "if", "implements",
    "import", "instanceof", "int", "interface", "long", "native",
    "new", "package", "private", "protected", "public", "return",
    "short", "static", "strictfp", "super", "switch", "synchronized",
    "this", "throw", "throws", "transient", "try", "void", "volatile",
    "while", "goto" ];

module.exports  = Object.freeze({
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
    },
    isJavaKeyWord:function (str) {
        for(let i = 0 ; i < JAVA_KEYWORD_LIST.length ; i++){
            let k = JAVA_KEYWORD_LIST[i];
            if(k === str){
                return true;
            }
        }
        return false;
    },
    accordJavaStandard:function (str) {
        let r = /^[A-Za-z_]+[A-Za-z_$\\d]+/;
        return r.test(str);
    }
})