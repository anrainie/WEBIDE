<template>
    <div class="editor-container">
        <div class="editor-header">
            <div class="editor-toolbar">
                <el-tooltip v-for="item in toolItems" class="item" effect="dark" :content="item.tooltip" placement="top-start">
                    <div class="editor-toolItem" @click="itemClick(item)">
                        <img v-bind:src="item.img"/>
                    </div>
                </el-tooltip>
            </div>
        </div>
        <div class="editor-header-indicator" @click="indicatorClick">
            <img src="../../asset/image/cursor_drag_hand.png"/>
        </div>
        <slot name="editor-content"></slot>
    </div>
</template>
<style>
    .editor-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .editor-header{
        height: 25px;
        margin-top: 5px;
    }
    .editor-toolbar{
        height: 25px;
    }
    .editor-toolItem{
        width: 20px;
        margin-left: 3px;
        display: inline-block;
        text-align: center;
    }
    .editor-toolItem:hover{
        background-color: #99A9BF;
    }
    .editor-header-indicator{
        position: absolute;
        background-color: #99A9BF;
        border:1px solid #99A9BF;
        border-radius:0 0 5px 5px;
        text-align: center;
        cursor:pointer;
        height: 20px;
        width: 40px;
        float:right;
        right: 1%;
        top: 26px;
    }
</style>
<script>
    export default{
        name:'editorContainer',
        props:['editor',"editorTools"],
        data(){
            return {
                isHide:true,
                $editorHeader:null,
                toolItems: [
                    {
                        id: "lock",
                        tooltip: "锁定文件",
                        img: "assets/image/lock.png",
                        handler:this.lock
                    },
                    {
                        id: "release_lock",
                        img: "assets/image/unlock.png",
                        tooltip: "解锁文件",
                        handler:this.release
                    },
                    {
                        id: "peek_lock",
                        img: "assets/image/peek_lock.png",
                        tooltip: "查看文件锁",
                        handler:this.peek
                    }
                ]
            }
        },
        methods:{
            itemClick(item){
                if(item.handler){
                    item.handler.call(this.editor);
                }
            },
            indicatorClick(){
                this.changeHeader(this.isHide = !this.isHide);
            },
            changeHeader(isHide){
                var indicatorTop = 0;
                if(isHide){
                    indicatorTop = '1px';
                }else{
                    indicatorTop = '26px';
                }
                this.$editorHeader.animate({height: 'toggle', opacity: 'toggle'}, "slow");
                this.$headerIndicator.animate({top: indicatorTop}, "slow");
            },
            println(str){
                this.infos.push(this.getDataStr() + str);
            },
            getDataStr() {
                var date = new Date();
                var month = replenish(date.getMonth() + 1);
                var dateStr = replenish(date.getDate());
                var hour = replenish(date.getHours());
                var minute = replenish(date.getMinutes());
                var second = replenish(date.getSeconds());
                return "[" + date.getFullYear() + "-" + month + "-" + dateStr
                        + " " + hour + ":" + minute + ":" + second + "]";
            },
            lock(){
                var self = this;
                IDE.socket.emit('lockFile',
                    {
                        type:IDE.type,
                        event:'lockFile',
                        data:{
                            uid:'123456',
                            path:this.editor.file.model.path
                        }
                    },function (respData) {
                        if(respData.state === 'success'){
                            self.$notify({
                                title: '提示',
                                message: '上锁成功',
                            });
                        }else if(respData.state === 'error'){
                            self.$notify({
                                title: '提示',
                                message: '上锁失败',
                            });
                        }
                    }
                );
            },
            release(){
                var self = this;
                IDE.socket.emit('releaseFilelock',
                    {
                        type:IDE.type,
                        event:'releaseFilelock',
                        data:{
                            uid:'123456',
                            path:this.editor.file.model.path
                        }
                    },function (respData) {
                        if(respData.state === 'success'){
                            self.$notify({
                                title: '提示',
                                message: '解锁成功',
                            });
                        }else if(respData.state === 'error'){
                            self.$notify({
                                title: '提示',
                                message: '解锁失败',
                            });
                        }
                    }
                );
            },
            peek(){
                var self = this;
                IDE.socket.emit('peekFileLock',
                    {
                        type:IDE.type,
                        event:'peekFileLock',
                        data:{
                            uid:'123456',
                            path:this.editor.file.model.path
                        }
                    },function (respData) {
                        self.$notify({
                            title: '提示',
                            message: respData.data,
                        });
                    }
                );
            }
        },
        mounted(){
            this.$editorHeader = $(this.$el).find(".editor-header");
            this.$headerIndicator =  $(this.$el).find(".editor-header-indicator");

            if(this.editorTools){
                for(let i = 0 ; i < this.editorTools.length ; i ++){
                    this.toolItems.push(this.editorTools[i]);
                }
            }

            this.changeHeader(true);
        }
    }
</script>