<template>
    <div class="container">

        <form name="registForm" class="form-regist" @submit.prevent="registUser()">
            <h2 class="form-regist-heading">注册帐号</h2>
            <label for="username" class="sr-only">UserName</label>
            <input type="username" id="username" name="username" class="form-control" placeholder="UserName"
                   v-model="user.username" required autofocus>
            <label for="password" class="sr-only">Password</label>
            <input type="password" id="password" name="password" class="form-control" placeholder="Password"
                   v-model="user.password" required>
            <label for="password_r" class="sr-only">Password</label>
            <input type="password" id="password_r" name="password_r" class="form-control" placeholder="Password"
                   v-model="user.password_r" required>
            <button class="btn btn-lg btn-primary btn-block" type="submit">注册</button>
        </form>

    </div>
</template>
<style>
    @import "~bootstrap/dist/css/bootstrap.css";

    .form-regist {
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;
    }

    .form-regist .form-control {
        position: relative;
        height: auto;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding: 10px;
        font-size: 16px;
    }

    .form-regist .form-control:focus {
        z-index: 2;
    }

    .form-regist input[type="username"] {
        margin-bottom: 10px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    .form-regist input[type="password"] {
        margin-bottom: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .form-regist input[type="password_r"] {
        margin-bottom: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
</style>
<script>
    export default {
        data (){
            return {
                user: {
                    name: '',
                    password: '',
                    password_r: ''
                }
            }
        },
        computed: {},
        methods: {
            registUser() {
                var username = document.registForm.username.value.trim();
                var password = document.registForm.password.value.trim();
                var password_r = document.registForm.password_r.value.trim();
                if (password != password_r) {
                    console.log(password);
                    alert("输入的两次密码不一致！");
                    return;
                }
                if (username != '' && password != '') {
                    var data = {
                        username: username,
                        password: password,
                        idename: 'AFAIDE'
                    }
                    this.$store.dispatch('registSubmit', data)
                } else {
                    console.log('注册失败！！！！');
                }
            }
        }
    }
</script>