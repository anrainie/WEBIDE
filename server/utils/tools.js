/**
 * Created by zcn on 2017/11/20.
 */
module.exports = Object.freeze({
    genUUID : function () {
        var len = 32;//32长度
        var radix = 16;//16进制
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },
    mergeService : function (source, target) {
        let s_services = source.services;
        let t_services = target.services;
        let services = {};
        for (let i = 0; i < t_services.length; i++) {
            let service = t_services[i];
            services[service.id] = null;
        }
        for (let i = 0; i < s_services.length; i++) {
            let service = s_services[i];
            if (!(service.id in services)) {
                t_services.push(service);
            }
        }
    }
});