/**
 * 产品配置
 *
 * Created by pang on 2017/6/1.
 */
const ServiceReg = require('./ServiceReg');

const ProductConfig = function (name) {
    this.name = name;
    this.serviceRegister = new ServiceReg();
    this.registService = function (eventName, service) {
        this.serviceRegister.regist(eventName, service);
    }
}
module.exports = ProductConfig;