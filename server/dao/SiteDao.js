const util = require('util');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dburl = require("../Config").db;//数据库地址

exports.connect = function (callback) {
    mongoose.connect(dburl);
}

exports.disconnect = function (callback) {
    mongoose.disconnect(callback);
}

exports.setup = function (callback) {
    callback(null);
}

//定义SiteUrl对象模型
const SiteUrlScheme = new Schema({
    username: String,
    idename: String,
    ip: {type: String, default: 'localhost'},
    port: {type: Number, default: 9090}
});

//访问todo对象模型
mongoose.model('SiteUrl', SiteUrlScheme);
const SiteUrl = mongoose.model('SiteUrl');

//exports.emptyNote = { "_id": "", author: "", note: "" };

exports.add = function (username, idename, ip, port, callback) {
    const siteUrl = new SiteUrl();
    siteUrl.username = username;
    siteUrl.idename = idename;
    siteUrl.ip = ip;
    siteUrl.port = port;
    siteUrl.save(function (err) {
        if (err) {
            util.log("FATAL" + err);
            callback(err);
        } else {
            callback(null);
        }
    });

}

exports.delete = function (id, callback) {
    exports.findSiteUrlById(id, function (err, doc) {
        if (err)
            callback(err);
        else {
            util.log(util.inspect(doc));
            doc.remove();
            callback(null);
        }
    });
}

exports.findByConditions = function (wherestr, callback) {
    SiteUrl.find(wherestr, function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, res);
        }
    })
}


exports.allSiteUrls = function (callback) {
    SiteUrl.find({}, callback);
}

exports.forAll = function (doEach, done) {
    SiteUrl.find({}, function (err, docs) {
        if (err) {
            util.log('FATAL ' + err);
            done(err, null);
        }
        docs.forEach(function (doc) {
            doEach(null, doc);
        });
        done(null);
    });
}

const findSiteUrlById = exports.findSiteUrlById = function (id, callback) {
    SiteUrl.findOne({_id: id}, function (err, doc) {
        if (err) {
            util.log('FATAL ' + err);
            callback(err, null);
        }
        callback(null, doc);
    });
}


