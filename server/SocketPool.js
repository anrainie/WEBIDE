/**
 * SocketIO连接池
 *
 * Created by pang on 2017/6/1.
 */
const ioclient = require('socket.io-client');
const User = require("./dao/UserDao");

const pool = new Map();

exports.getConnection = function (username, idename, callback) {
    const key = idename + '_' + username;
    if (!pool.has(key) || pool.get(key) == null || pool.get(key) == undefined) {
        exports.regist(username, idename, function (err, client) {
            if (err) {
                callback(err, null);
            }else{
                callback(null, client);
            }
        });
    } else {
        const client = pool.get(key);
        // if(!client.isConnected()){
        //     client.reconnect();
        // }
        callback(null, client);
    }
};


const regist = exports.regist = function (username, idename, callback) {
    User.findByConditions({'username': username, 'idename': idename}, function (err, res) {
        if (err) {
            console.log("Error:" + err);
        } else {
            if (res.length == 0) {
                callback("Socket pool regist connection error,cause by user has not existed: " + username, null);
            } else if (res.length == 1) {
                console.log(res);
                const urlStr = 'http://' + res[0].ip + ':' + res[0].port;
                const client = ioclient.connect(urlStr);
                pool.set(username, client);
                callback(null, client);
            } else {
                callback("Socket pool regist connection error,cause by has repeat username: " + user.username, null);
            }

        }

    });
};

exports.unregist = function (username) {
    const client = pool.get(username);
    if (client != null && client.isConnected()) {
        client.disconnected();
    }
    pool.remove(username);
};

const forAll = exports.forAll = function () {
    pool.forEach(function (value, key, map) {
        console.log(key, value);
    });
};
