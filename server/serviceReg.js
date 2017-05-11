/**
 * 服务注册器
 *
 * Created by Hasee on 2017/5/10.
 */
import mongo from 'mongodb';

var all = mongo.db.user;

module.exports = function () {

    return {
        regist(service){

        },
        unregist(){

        },
        all(){
            return all;
        }
    }
};

