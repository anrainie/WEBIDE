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
}