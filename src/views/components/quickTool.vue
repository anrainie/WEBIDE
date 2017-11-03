<template>
    <div class="quickBar">
        <span class="item tool-icon icon-search"></span>
        <span class="item tool-icon icon-info"></span>
        <span class="item tool-icon icon-preference"></span>
        <span class="item tool-icon icon-user"></span>
    </div>
</template>
<style>
    @import "../../asset/style/fontStyle.css";

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
        font-size: 17px;
        margin-left: 10px;
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