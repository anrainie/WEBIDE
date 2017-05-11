/**
 * Created by Hasee on 2017/5/10.
 */
service = function (handle) {

    io.on();

    return {
        handle: function(data,callback){
            var md5;
            data.event=md5;
            io.emit(data.name,data.data);

            io.once(md5,function(data){
                callback(data);
            });
        }
    }
};


module.exports = function () {
    return {
        init(handle){
            return new service(handle);
        }
    }
};

var service = require('service');

var afaService = service.init(ip,port);