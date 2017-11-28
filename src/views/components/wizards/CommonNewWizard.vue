<template>
    <el-dialog
            :title="'新建'+resName"
            :visible.sync="dialogFormVisible" @close="close">
        <el-form>
            <el-form-item :label="resName + '名称'" :label-width="labelWidth">
                <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item :label="resName + '描述'" :label-width="labelWidth">
                <el-input v-model="desc"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                domain:null,
                dialogFormVisible: true,
                template: false,
                labelWidth: '140px',
                name:'',
                desc:'',
            }
        },
        props:{
            parent:{
                type:String,
            },
            resId:{
                type:String,
            },
            resName:{
                type:String,
            },
        },
        component: {},
        methods: {
            handleOk(){
                var self = this;
                if (!this.name || !this.desc) {
                    alert("名字和描述不能为空");
                } else {
                    this.dialogFormVisible = false;
                    IDE.socket.emit("createNewResource", {
                        type: self.domain,
                        event: 'createNewResource',
                        data: {
                            path: this.parent,
                            resourceId: this.resId,
                            name: this.name,
                            description: this.desc
                        }
                    }, function (result) {
                        if (result) {
                            if (result.state === 'success') {
                                let path = result.data.path;
                                //刷新
                                if (path)
                                    IDE.navigator.refresh(path);
                                else
                                    IDE.navigator.refresh(null);
                                let type = result.data.type;
                                if (type === 'file') {
                                    let item = IDE.navigator.getItem(path);
                                    let input = result.data.input;
                                    if (input) {
                                        //打开编辑器
                                        IDE.editorPart.openEditor(item, input);
                                    }
                                }
                            }
                        }
                    });
                }
            },
            close(){
                this.$el.parentNode.removeChild(this.$el);
            }
        },
        mounted(){
        }
    }
</script>