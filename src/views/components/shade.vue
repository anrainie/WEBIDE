<template>
    <div v-show="isVisible" class="shade">
        <div class="shade-msg">
            {{msg}}
        </div>
        <div class="shade-progress">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    </div>
</template>
<style rel="stylesheet">
    .shade{
        position: absolute;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
        opacity: 0.5;
        text-align: center;
        background-color: darkgrey;
    }
    .shade-msg{
        position: relative;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        top:25%;
        margin:0px auto;
        color: #1e3f57;
        font-size: 70px;
    }

    .shade-progress {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200px;
        height: 200px;
        margin-top: -100px;
        margin-left: -100px;
        perspective: 100px;
        transform-type: preserve-3d;
        animation: shade-progress 6s cubic-bezier(0,0,1,1) infinite;
    }

    @keyframes shade-progress {
        0% {
            transform: rotateX(30deg) rotateZ(0deg);
        }
        100% {
            transform: rotateX(30deg) rotateZ(-360deg);
        }
    }

    .dot {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 10;
        width: 20px;
        height: 20px;
        margin-top: -70px;
        margin-left: -10px;
        border-radius: 10px;
        background-color: #1e3f57;
        transform-type: preserve-3d;
        transform-origin: 40% 70px;
        transform: rotateZ(30deg);
        animation: dot1 1.5s cubic-bezier(.6,0,.4,1) infinite;
    }

    .dot:nth-child(2) {
        transform: rotateZ(15deg);
        animation-name: dot2;
        animation-delay: 150ms;
        background-color: #2d556d;
    }

    .dot:nth-child(3) {
        transform: rotateZ(0deg);
        animation-name: dot3;
        animation-delay: 300ms;
        background-color: #447891;
    }

    .dot:nth-child(4) {
        transform: rotateZ(-15deg);
        animation-name: dot4;
        animation-delay: 450ms;
        background-color: #5998b2;
    }

    .dot:nth-child(5) {
        transform: rotateZ(-30deg);
        animation-name: dot5;
        animation-delay: 600ms;
        background-color: #6bb2cd;
    }

    /* Dot animations */
    @keyframes dot1 {
        0% {
            transform: rotateZ(30deg) rotateX(10deg);
        }
        95%, 100% {
            transform: rotateZ(390deg) rotateX(10deg);
        }
    }

    @keyframes dot2 {
        0% {
            transform: rotateZ(15deg) rotateX(10deg);
        }
        95%, 100% {
            transform: rotateZ(375deg) rotateX(10deg);
        }
    }

    @keyframes dot3 {
        0% {
            transform: rotateZ(0deg) rotateX(10deg);
        }
        95%, 100% {
            transform: rotateZ(360deg) rotateX(10deg);
        }
    }

    @keyframes dot4 {
        0% {
            transform: rotateZ(-15deg) rotateX(10deg);
        }
        95%, 100% {
            transform: rotateZ(345deg) rotateX(10deg);
        }
    }

    @keyframes dot5 {
        0% {
            transform: rotateZ(-30deg) rotateX(10deg);
        }
        95%, 100% {
            transform: rotateZ(330deg) rotateX(10deg);
        }
    }
</style>
<script type="text/javascript">
    export default{
        name:"shade",
        data:function () {
            return {
                count:0,
                defaultMsg:"Loading...",
                msg: null
            }
        },
        computed: {
            isVisible : function () {
                return this.count > 0;
            }
        },
        methods:{
            open : function (msg) {
                this.count++;
                if(!msg){
                    this.msg = this.defaultMsg;
                }else{
                    this.msg = msg;
                }
            },
            hide:function () {
                this.count--;
                if(this.count == 0){
                    this.msg = this.defaultMsg;
                }
            },
            setMsg(msg){
                if(this.count > 0) {
                    this.msg = msg
                }
            }
        }
    }
</script>