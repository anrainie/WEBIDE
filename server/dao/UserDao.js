const util = require('util');
//用于md5加密
const bcrypt = require('bcryptjs');
//加盐数
const SALT_WORK_FACTOR = 10;

const dbConstants = require('../constants/DBConstants');


function getUserCollection() {
    return IDE.DB.getOrCreateCollection(dbConstants.USER)
}

function save(user,next) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err)

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err)
            user.password = hash;
            let userColl = getUserCollection();
            userColl.insert(user);
            next();
        });
    });
}

function del(query) {
    let userColl = getUserCollection();
    userColl.findAndRemove(query);
}

function findUser(query) {
    let userColl = getUserCollection();
    return userColl.findOne(query);
}

function findUsers(query) {
    let userColl = getUserCollection();
    return userColl.find(query);
}

function comparePassword(password1,passwrod2, cb) {
    bcrypt.compare(password1, passwrod2, function (err, isMatch) {
        if (err)
            return cb(err)
        cb(null, isMatch)
    })
}

module.exports = {
    save:save,
    del:del,
    findUser:findUser,
    findUsers:findUsers,
    comparePassword:comparePassword
}

