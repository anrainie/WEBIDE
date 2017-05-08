<template>
    <div>
        <div class="top">{{pageName.length}}
            <input type="text" v-model="pageName"/>
        </div>
        <div class="mid">
            <div class="navi">
                <navigator :model='model' v-for='model in models'></navigator>
            </div>
            <!--<editor></editor>-->
        </div>
        <div class="bottom">这里是bottom</div>
    </div>
</template>
<style>
    .top {
        position: relative;
        padding:0px 40px ;
        width:100%;
        height:80px;
        background-color: #57A;
    }

    .mid {
        position: absolute;
        padding: 2px 10px;
        bottom:40px;
        top:84px;
        width:100%;
        background-color: #AAA;
    }

    .navi {
        position: relative;
        width: 180px;
        margin: 0 0 0 0;
        padding: 10px;
        height:100%;
        border: 1px solid #999;
        background-color: #FFF;
    }
    .bottom{
        position:absolute;
        width:100%;
        height:40px;
        bottom:0px;
        background-color: #0C7;
    }
</style>
<script>
    import navi from "../components/navigator.vue";

    export default{
        data(){
            return {
                pageName:"pageName",
                models: [{
                    "id": "1",
                    "data": {
                        "menuName": "项目管理",
                        "menuCode": "",
                    },
                    "childTreeNode": [{
                        "data": {
                            "menuName": "项目",
                            "menuCode": "BusProject",
                        },
                        "childTreeNode": [
                            {
                                "data": {
                                    "menuName": "子项目",
                                    "menuCode": "subProject"
                                }
                            }
                        ]
                    }, {
                        "data": {
                            "menuName": "我的任务",
                            "menuCode": "BusProject",
                        },
                        "childTreeNode": []
                    }, {
                        "data": {
                            "menuName": "人员周报",
                            "menuCode": "BusProject",
                        },
                        "childTreeNode": []
                    }]
                }, {
                    "id": "2",
                    "data": {
                        "menuName": "数据统计",
                        "menuCode": "BusClock",
                    },
                    "childTreeNode": []
                }, {
                    "id": "3",
                    "data": {
                        "menuName": "人事管理",
                        "menuCode": "",
                    },
                    "childTreeNode": []
                }, {
                    "id": "4",
                    "data": {
                        "menuName": "基础管理",
                        "menuCode": "",
                    },
                    "childTreeNode": []
                }]
            }
        },
        methods: {
            reverseMessage: function () {
                this.message = this.message.split('').reverse().join('')
            }
        },
        components: {
            navigator: navi
        }
    }
</script>