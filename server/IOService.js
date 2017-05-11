/**
 * Created by Hasee on 2017/5/10.
 */
service = function (handle) {

    io.on();

    return {
        handle: function (data) {
            //成功或者失败由报文data决定
            /**
             * data:{
             *  name:'delete'
             *  data:{
             *      url:''
             *  },
             *  event:'aasdad13daf31'
             * }
             */
            io.emit(data.name, data);

            io.once(data.event, function (data) {
                callback(data);
            });
        }
    }
};


module.exports = function () {
    return {
        init(config){
            return new service(config);
        }
    }
};

var service = require('service');

var afaService = service.init({ip: '192.168.0.4', port: 3300});