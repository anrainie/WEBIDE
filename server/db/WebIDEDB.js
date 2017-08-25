var loki = require("lokijs");

function WebIDEDB(config) {
    this.config = config;
}

WebIDEDB.prototype.start = function () {
    this.db = new loki(this.config.dbpath,{
        env:'NODEJS',
        verbose:true,
        autosave:true,
        autosaveInterval:10000,
    });
    this.db.loadDatabase();
}

WebIDEDB.prototype.addCollection = function (name,options) {
    return this.db.addCollection(name,options);
}

WebIDEDB.prototype.getCollection = function (name) {
    return this.db.getCollection(name);
}

WebIDEDB.prototype.getOrCreateCollection = function (name,createOptions) {
    var c = this.db.getCollection(name);
    if(!c){
        c = this.addCollection(name,createOptions);
    }
    return c;
}

WebIDEDB.prototype.removeCollection = function (name) {
    return this.db.removeCollection(name);
}

WebIDEDB.prototype.findByCollection = function (collection,query) {
    return collection.find(query);
}


WebIDEDB.prototype.saveDatabase = function () {
    this.db.saveDatabase();
}


module.exports = WebIDEDB;