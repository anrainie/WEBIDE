/**
 * 服务注册器
 *
 * Created by pang on 2017/5/10.
 */
const ServiceReg = function () {
    this.servicePool = new Map();
    this.regist = function (eventName, service) {
        if (!this.servicePool.has(eventName) || this.servicePool.get(eventName) == null || this.servicePool.get(eventName) == undefined) {
            this.servicePool.set(eventName, service);
        } else {
            console.log('service regist fail! type ==> ' + eventName);
        }
    }
    this.unregist = function (eventName) {
        if (!this.servicePool.has(eventName) || this.servicePool.get(eventName) == null || this.servicePool.get(eventName) == undefined) {
            console.log('service unregist fail! type ==> ' + eventName);
        } else {
            this.servicePool.delete(eventName);
        }
    }
    this.getServiceByEventName = function (eventName) {
        return this.servicePool.get(eventName);
    }
}
module.exports = ServiceReg;


