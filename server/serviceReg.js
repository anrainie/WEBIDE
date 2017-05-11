/**
 * 服务注册器
 *
 * Created by Hasee on 2017/5/10.
 */
import mongo from 'mongodb';

var all = mongo.db.user;

/**
 *
 * {
 *  'afa':{
 *      a:'192.168.1.1',
 *      b:'192.168.1.2'
 *      },
 *  'aweb':{
 *   }
 * }
 *
 *
 * @returns {{regist: (function(*)), unregist: (function()), all: (function())}}
 */

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

