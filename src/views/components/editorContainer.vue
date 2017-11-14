<template>
    <div class="editor-container">
        <div class="editor-header">
            <div class="editor-toolbar">
                <el-tooltip v-for="item in toolItems" class="item" effect="dark" :content="item.tooltip"
                            placement="top-start">
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
</style>
<script>
    export default{
        name: 'editorContainer',
        props: {
            editor: null,
            domain:null,
            editoractions: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        }
        ,
        data(){
            return {
                isHide: true,
                $editorHeader: null,
                toolItems: [
                    {
                        id: "lock",
                        tooltip: "锁定文件",
                        img: "/assets/image/lock.png",
                        handler: this.lock
                    },
                    {
                        id: "release_lock",
                        img: "/assets/image/unlock.png",
                        tooltip: "解锁文件",
                        handler: this.release
                    },
                    {
                        id: "peek_lock",
                        img: "/assets/image/peek_lock.png",
                        tooltip: "查看文件锁",
                        handler: this.peek
                    }
                ]
            }
        },
        methods: {
            itemClick(item){
                if (item.handler) {
                    item.handler.call(this.editor);
                }
            },
            maximize(){
                this.$el.classList.add('MAXIMIZE');
            },
            normalize(){
                this.$el.classList.remove('MAXIMIZE');
            },
            indicatorClick(){
                this.changeHeader(this.isHide = !this.isHide);
            },
            changeHeader(isHide){
                var indicatorTop = 0;
                if (isHide) {
                    indicatorTop = '1px';
                } else {
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
                        type: self.domain,
                        event: 'lockFile',
                        data: {
                            path: this.editor.file.path
                        }
                    }, function (respData) {
                        if (respData.state === 'success') {
                            self.$notify({
                                title: '提示',
                                message: '上锁成功',
                            });
                        } else if (respData.state === 'error') {
                            self.$notify({
                                title: '提示',
                                message: '上锁失败,' + respData.errorMsg,
                            });
                        }
                    }
                );
            },
            release(){
                var self = this;
                IDE.socket.emit('releaseFilelock',
                    {
                        type: self.domain,
                        event: 'releaseFilelock',
                        data: {
                            path: this.editor.file.path
                        }
                    }, function (respData) {
                        if (respData.state === 'success') {
                            self.$notify({
                                title: '提示',
                                message: '解锁成功',
                            });
                        } else if (respData.state === 'error') {
                            self.$notify({
                                title: '提示',
                                message: '解锁失败,' + respData.errorMsg,
                            });
                        }
                    }
                );
            },
            peek(){
                var self = this;
                IDE.socket.emit('peekFileLock',
                    {
                        type: self.domain,
                        event: 'peekFileLock',
                        data: {
                            path: this.editor.file.path
                        }
                    }, function (respData) {
                        if (respData.data == null) {
                            self.$notify({
                                title: '提示',
                                message: '该文件未被上锁',
                            });
                        } else {
                            self.$notify({
                                title: '提示',
                                message: '该文件已被上锁，持有者：' + respData.data.username,
                            });
                        }

                    }
                );
            }
        },
        mounted(){
            this.$editorHeader = $(this.$el).find(".editor-header");
            this.$headerIndicator = $(this.$el).find(".editor-header-indicator");

            if (this.editoractions) {
                for (let i = 0; i < this.editoractions.length; i++) {
                    this.toolItems.push(this.editoractions[i]);
                }
            }

            this.$on('maximize', () => {
                this.maximize();
            });

            this.$on('normalize', () => {
                this.normalize();
            });

            this.changeHeader(true);
        }
    }
</script>