const util = require('util');
//用于md5加密
const bcrypt = require('bcryptjs')
//加盐数
const SALT_WORK_FACTOR = 10
const mongoose = require('mongoose');

//定义SiteUrl对象模型
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    idename: String,
    ip: {type: String, default: 'localhost'},
    port: {type: Number, default: 9090},
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//对密码进行加密
UserSchema.pre('save', function (next) {
    var user = this
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now()
    }
    else {
        this.updateAt = Date.now()
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err)

            user.password = hash;

            next()
        })
    })
})
//用于比较密码是否正确
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) return cb(err)
            cb(null, isMatch)
        })
    }
}

UserSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
    ,
    findByConditions: function(wherestr, cb){
        return this.find(wherestr).exec(cb);
    },
    findOneRecord: function (wherestr, cb) {
        return this.findOne(wherestr).exec(cb);
    },
    removeByConditions: function (wherestr, cb) {
        return this.remove(wherestr).exec(cb)
    }

}

//访问todo对象模型
const User = mongoose.model('User', UserSchema);
module.exports = User

