/**
 * Created by zcn on 2017/10/10.
 */
function ProductManager() {
    this.products = [];
}

ProductManager.prototype.getProduct = function (id) {
    for(let i = 0 ; i < this.products.length ; i++){
        if(this.products[i].id === id){
            return this.products[i];
        }
    }
    return null;
}

ProductManager.prototype.getAllProducts = function () {
    return [].concat(this.products);
}

ProductManager.prototype.addProduct = function (product) {
    this.products.push(product);
}

ProductManager.prototype.removeProduct = function (id) {
    for(let i = 0 ; i < this.products.length ; i++){
        if(this.products[i].id === id){
            this.products.splice(i ,1);
            break;
        }
    }
}

module.exports = ProductManager;