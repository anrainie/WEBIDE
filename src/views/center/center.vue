<template>
    <div class="entrys">
        <router-link :to="'afa'" class="entry">
            <p>AFA</p>
        </router-link>
        <router-link :to="'aweb'" class = "entry">
            <p>AWEB</p>
        </router-link>
    </div>
</template>
<style>
    .entrys{
        width: 100%;
        height: 100%;
        text-align: center;
        background-image: url("~assets/image/center-bg.png");
        background-size: 100% 100%;
        background-repeat:no-repeat;
    }
    .entry{
        position: relative;
        display: inline-block;
        width: 200px;
        height: 200px;
        text-align: center;
        top:20%;
        background-color: rgb(158,168,181);
        margin-left: 20px;
        border-radius:10px;
        opacity:0.7;
        text-decoration: none;
    }

    .entry:hover{
        opacity:1.0;
    }

    .entry p{
        position: relative;
        top: 10%;
        color: black;
        text-decoration: none;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 300;
        font-size: 50px;
    }
</style>
<script>
    export default{
        data(){
            return {}
        },
        methods: {
        }
    }
</script>