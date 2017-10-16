/**
 * Created by zcn on 2017/10/11.
 */
const dbConstants = require('../constants/DBConstants');
function getProductCollection() {
    return IDE.DB.getCollection(dbConstants.PRODUCT);
}
function getAllProducts(){
    let productColl = getProductCollection();
    let db_products = productColl.find();
    if(db_products){
        let result = [];
        for(let i = 0 ; i < db_products.length ; i++){
            let dbP = db_products[i];
            result.push({
                id:dbP.id,
                name:dbP.name,
                type:dbP.type,
                ip:dbP.ip,
                port:dbP.port,
            })
        }
        return result;
    }else{
        return [];
    }
}

function saveProduct(product) {
    let productColl = getProductCollection();
    productColl.insert(product);
}

function delProduct(query) {
    let productColl = getProductCollection();
    productColl.findAndRemove(query);
}

function findProduct(query) {
    let productColl = getProductCollection();
    return productColl.findOne(query);
}

function findProducts(query) {
    let productColl = getProductCollection();
    return productColl.find(query);
}

function updateProduct(product,next) {
    let pid = product.id;
    let productColl = getProductCollection();
    productColl.findAndUpdate({id:pid},function (oldProduct) {
        if(oldProduct) {
            oldProduct.name = product.name;
            oldProduct.ip = product.ip;
            oldProduct.port = product.port;
            oldProduct.type = product.type;
            productColl.update(oldProduct);
            next();
        }else{
            next(new Error("can not find product item :" + pid));
        }
    })
}

module.exports = {
    getAllProducts : getAllProducts,
    save:saveProduct,
    delProduct:delProduct,
    findProduct:findProduct,
    findProducts:findProducts,
    updateProduct:updateProduct
}