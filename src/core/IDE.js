/**
 * Created by zcn on 2017/11/16.
 */
function IDE() {
    let listeners = {};
    let keyStore = {};
    const _service = {};

    return {
        services(type){
            if (_service[type] == null) {
//                                const s=;
                _service[type] = require('./' + type + '/config/services.js');
            }
            if (_service[type] == null)
                throw type + ' has no service registed';
            return _service[type];
        },
        on(key, callback){
            //确保前置执行
            if (keyStore[key]) {
                callback();
            }
            if (listeners[key] == null) {
                listeners[key] = [];
            }
            listeners[key].push({
                callback: callback
            });
        },
        once(key, callback){
            //确保前置执行一次
            if (keyStore[key]) {
                callback();
                return;
            }
            if (listeners[key] == null) {
                listeners[key] = [];
            }
            listeners[key].push({
                callback: callback,
                once: true
            });
        },
        off(key, targetCall){
            //移除指定callback，反之移除全部
            if (targetCall) {
                if (listeners.key) {
                    let list = listeners[key];
                    for (let i = 0; i < list.length; i++) {
                        if (targetCall == list[i].callback) {
                            list.splice(i, 1);
                            return;
                        }
                    }
                }
            } else
                listeners.key = null;
        },
        /**
         *
         * @param key
         * @param save 使未注册的元素立刻执行一次
         */
        emit(key, save){
            if (save)
                keyStore[key] = true;
            let list = listeners[key];
            if (list)
                for (let i = 0; i < list.length; i++) {
                    list[i].callback();
                    if (list[i].once) {
                        list.splice(i, 1);
                        i--;
                    }
                }
        },
        post(url,data,useShade,timeout = 15000){
            let def = $.Deferred();
            if(useShade === true){
                IDE.shade.open();
            }
            $.post('/user/changeProduct',data,(result) => {
                if(useShade === true) {
                    IDE.shade.hide();
                }

                if(result.state === 'success'){
                    def.resolve(result);
                }else if(result.state === 'error'){
                    def.reject(result);
                }

            });

            setTimeout(function () {
                if(def.state() === 'pending'){
                    def.reject({state:'error',errorMsg:'ajax post timeout :' + url});
                }
            },timeout);

            return def.promise();
        }
    }
};

export default IDE
