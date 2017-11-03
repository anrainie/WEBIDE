/**
 * Created by zcn on 2017/8/7.
 */
import io from 'socket.io-client';
import ElementUI from 'element-ui';
function IDESocket() {
    this.sockets = {};

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
            ElementUI.Notification.error({
                title: '提示',
                message: '文件锁超时被释放,' + data
            });
        });
        return def.promise();
    };
}


IDESocket.prototype.emit = function (eventId, data, callback) {
    debug.info("IDESocket emit,event:" + data.event);
    let socketDef = this.getSocket(data.type);
    socketDef.done((socket) => {
        if (socket.connected) {
            if (!data) {
                data = {};
            }
            data.event = data.event || eventId;
            socket.emit(socket.type + "_" + eventId, data, callback);
        } else {
            ElementUI.Notification.error({
                title: '提示',
                message: 'node socket is disconnect'
            });
        }
    });
}

IDESocket.prototype.emitAndGetDeferred = function (eventId, data) {
    debug.info("IDESocket emit,event:" + data.event);
    let socketDef = this.getSocket(data.type);
    let def = $.Deferred();
    socketDef.done((socket) => {
        if (socket.connected) {
            if (!data) {
                data = {};
            }
            data.event = data.event || eventId;
            socket.emit(socket.type + "_" + eventId, data, function (result) {
                if (result.state === 'success') {
                    def.resolve(result);
                } else if (result.state === 'error') {
                    def.reject(result);
                }
            });
        }
    });
    return def.promise();
}

export default IDESocket;
