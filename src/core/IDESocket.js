/**
 * Created by zcn on 2017/8/7.
 */
import io from 'socket.io-client';
import ElementUI from 'element-ui';
function IDESocket() {
    this.sockets = {};
    this.timeout = 15 * 1000;
    this.getSocket = (type) => {
        type = type || IDE.type;
        let s = this.sockets[type];
        if (s == null) {
            s = this.init(type);
            this.sockets[type] = s;
        }
        return s;
    };

    this.init = (type) => {
        let socket = io(window.location.host + "?" + "type=" + type, {
            reconnectionAttempts: 20
        });
        socket.type = type;
        socket.isReady = false;
        let def = $.Deferred();

        socket.on('connect_error', (err) => {
            let r = {
                title: '提示',
                message: 'node socket连接失败' + type,
                duration: 0
            };
            ElementUI.Notification.error(r.message);
            throw  r.message;
        });

        socket.on('connect_timeout', function (err) {
            ElementUI.Notification.error({
                title: '提示',
                message: 'node socket连接超时',
                duration: 0
            });
        });

        socket.on('connect', function () {
            if (!socket.isReady) {
                ElementUI.Notification.success({
                    title: '提示',
                    message: 'node socket连接成功',
                    duration: 2000
                });
                def.resolve(socket);
                IDE.emit('connected success', true);
                socket.isReady = true;
            }
        });

        socket.on('reconnect_error', function (data) {
            ElementUI.Notification.error({
                title: '提示',
                message: 'node socket重连失败',
                duration: 0
            });
        });

        socket.on('lockTimeout', function (data) {
            let paths = data.split("/");
            let name = paths[paths.length - 1];
            ElementUI.Notification.error({
                title: '提示',
                message: '文件锁超时被释放,' + name
            });
        });
        return def.promise();
    };
}


IDESocket.prototype.emit = function (eventId, data, callback,timeout) {
    if(timeout && !$.isNumeric(timeout)){
        throw new Error("socket timeout must be a number" + timeout);
    }else{
        timeout = this.timeout;
    }

    data = data || {};
    data.event = data.event || eventId;

    debug.info("IDESocket emit,event:" + data.event);

    let socketDef = this.getSocket(data.type);
    socketDef.done((socket) => {
        if (socket.connected) {
            let success = false;
            socket.emit(socket.type + "_" + eventId, data, (result) => {
                success = true;
                callback(result);
            });
            setTimeout(()=>{
                if(!success){
                    callback({state:'error',errorMsg:'emit callback timeout :' + eventId});
                }
            },timeout);
        } else {
            ElementUI.Notification.error({
                title: '提示',
                message: 'node socket is disconnect'
            });
        }
    });
}

IDESocket.prototype.emitAndGetDeferred = function (eventId, data,timeout) {
    if(timeout && !$.isNumeric(timeout)){
        throw new Error("socket timeout must be a number" + timeout);
    }else{
        timeout = this.timeout;
    }

    data = data || {};
    data.event = data.event || eventId;

    debug.info("IDESocket emit,event:" + data.event);

    let socketDef = this.getSocket(data.type);
    let def = $.Deferred();
    socketDef.done((socket) => {
        if (socket.connected) {
            if (!data) {
                data = {};
            }
            let success = false;
            socket.emit(socket.type + "_" + eventId, data, function (result) {
                success = true;
                if (result.state === 'success') {
                    def.resolve(result);
                } else if (result.state === 'error') {
                    def.reject(result);
                }
            });
            setTimeout(()=>{
                if(!success){
                    def.reject({state:'error',errorMsg:'emit callback timeout :' + eventId});
                }
            },timeout);
        }
    });
    return def.promise();
}

export default IDESocket;
