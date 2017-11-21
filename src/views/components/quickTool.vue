<template>
    <div class="quickBar">
        <span class="item tool-icon" style="background-image: url(assets/image/user.png)"></span>
        <span class="item tool-icon" style="background-image: url(assets/image/logout.png)"></span>
    </div>
</template>
<style>
    .quickBar{
        background-color: #000000;
        display: inline-block;
        position: absolute;
        width: 30%;
        padding: 0px 8px;
        height: 25px;
        margin: 0;
        text-align: right;
    }

    .tool-icon{
        background-repeat: no-repeat;
        margin-left: 10px;
        display: inline-block;
        width:16px;
        height: 16px;
        margin-top: 5px;
    }

    .tool-icon:hover{
        background-color:gray;
    }
</style>
<script>

    export default {
        name:'quickTool',
        props: ['menuData'],
        data() {
            return {

            }

        },
    }
</script>