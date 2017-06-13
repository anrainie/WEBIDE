/**
 * Created by pang on 2017/6/12.
 */
import axios from 'axios';
import VueRouter from  '../router/routes';
const userModule = {
    state: {
        domain:'http://test.example.com', //保存后台请求的地址，修改时方便（比方说从测试服改成正式服域名）
        user: { //保存用户信息
            username: null,
            password: null
        }
    },
    getters: {
        getUsername: state => state.user.username
    },
    mutations: {
        setUsername(state, data) {
            state.user.username = data
        }
    },
    actions: {
        registSubmit({commit}, reqData) {
            axios.post('/user/signup', reqData)
                .then(function (rspData) {
                    if (rspData.data.errno === 0) {
                        console.log('注册成功！！！！！！！');
                        VueRouter.push({path:'/login'});
                    } else {
                        alert(rspData.data.msg);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
        },
        loginSubmit({commit}, reqData) {
            axios.post('/user/signin', reqData)
                .then(function (rspData) {
                    if (rspData.data.errno === 0) {
                        commit('setUsername', reqData.username);
                        VueRouter.push({path:'/center'});
                    } else {
                        alert(rspData.data.msg);
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        }
    }
}
export default userModule
