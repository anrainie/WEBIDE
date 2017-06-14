const ProductReg = require('./ProductReg');
const ProductConfig = require('./ProductConfig');
const IOService = require('./IOService');

const productReg = new ProductReg();
exports.init = function () {
    const afaProductConfig = new ProductConfig('AFAIDE');
    afaProductConfig.registService('reqInitNav', new IOService());
    productReg.regist('AFAIDE', afaProductConfig);
}

exports.getServiceByReqData = function (reqData) {
    const type = reqData.type;
    const eventName = reqData.service;
    const productConfig = productReg.getProductConfigByIDE(type);
    const serviceRegister = productConfig.serviceRegister;
    return serviceRegister.getServiceByEventName(eventName);
}

exports.getAllEvent = function () {
    const eventArr = new Array();
    for (const [ide, productConfig] of productReg.productConfigPool) {
        const serviceRegister = productConfig.serviceRegister;
        for (const eventStr of serviceRegister.servicePool.keys()) {
            if (eventArr.indexOf(eventStr) == -1) {
                eventArr.push(eventStr);
            }
        }
    }
    return eventArr;
}
