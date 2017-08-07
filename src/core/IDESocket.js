/**
 * Created by zcn on 2017/8/7.
 */
import io from 'socket.io-client';
import ElementUI from 'element-ui';
function IDESocket() {
    let first = true;

    let socket = io("http://localhost:8080");

    socket.on('connect_error', function (err) {
        ElementUI.Notification.error({
            title: '提示',
            message: 'ide socket连接失败',
            duration: 0
        });
    });

    socket.on('connect', function () {
        if (first) {
            ElementUI.Notification.success({
                title: '提示',
                message: 'ide socket连接成功',
                duration: 2000
            });
            IDE.emit('connected success', true);
            first = false;
        }
    });

    socket.on('reconnect_error', function (data) {
        ElementUI.Notification.error({
            title: '提示',
            message: 'ide socket重连失败',
            duration: 0
        });
    })

    this.socket = socket;
}

IDESocket.prototype.emit = function (eventId,data,callback) {
    debug.info("IDESocket emit,event:" + data.event);
    if(this.socket.connected){
        this.socket.emit(eventId,data,callback);
    }else{
        ElementUI.Notification.error({
            title: '提示',
            message: 'ide socket is offline'
        });
    }
}

export default IDESocket;
