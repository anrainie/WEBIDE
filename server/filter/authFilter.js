/**
 * Created by zcn on 2017/11/17.
 */


function authFilter() {
    return function authFilter(req,res,next) {
        if(req.session === undefined || req.session.user === undefined){
            return next(new Error(`want to access ${req.url} but no session`));
        }
        next();
    }
}
module.exports = authFilter;