/**
 * 产品注册器
 *
 * Created by pang on 2017/6/1.
 */
const ProductReg = function () {
    this.productConfigPool = new Map();
    this.regist = function (ide, productConfig) {
        if (!this.productConfigPool.has(ide) || this.productConfigPool.get(ide) == null || this.productConfigPool.get(ide) == undefined) {
            this.productConfigPool.set(ide, productConfig);
        } else {
            console.log('service regist fail! type ==> ' + ide);
        }
    }
    this.unregist = function (ide) {
        if (!this.productConfigPool.has(ide) || this.productConfigPool.get(ide) == null || this.productConfigPool.get(ide) == undefined) {
            console.log('service unregist fail! type ==> ' + ide);
        } else {
            this.productConfigPool.delete(ide);
        }
    }
    this.getProductConfigByIDE = function (ide) {
        return this.productConfigPool.get(ide);
    }
}
module.exports = ProductReg;