<template>
    <el-dialog
            :title="wizardtitle"
            :visible.sync="dialogFormVisible" @close="close">
        <!--<div>{{pagetitle}}</div>-->
        <!--<div>{{pagedesc}}</div>-->
        <el-form>
            <el-form-item :label="namelabel.label" :label-width="labelWidth">
                <el-input v-model="name" auto-complete="off">{{namelabel.value}}</el-input>
            </el-form-item>
            <!-- <el-form-item :label-width="labelWidth">
                 <el-cascader>
                        <:options="reference">
                        <v-model="selectedOptions">
                        @change="handleChange">
                </el-cascader>
             -->
            <!--</el-form-item>-->
            <el-form-item :label="desclabel.label" :label-width="labelWidth">
                <el-input v-model="desc" auto-complete="off">{{desclabel.value}}</el-input>
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
                name: '',
                desc: '',
                resourceId: '',
                path: '',
                type: '',
                wizardtitle: '',
                pagetitle: '',
                pagedesc: '',
                namelabel: {
                    label: '',
                    value: ''
                },
                catelog: '',
                group: {
                    label: '',
                    value: ''
                },
                reference: {
                    label: '',
                    value: ''
                },
                desclabel: {
                    label: '',
                    value: ''
                },
                refLabel: ''
            }
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
                            path: this.path,
                            resourceId: this.resourceId,
                            type: this.type,
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
            handleBroswer(){
                //获取相关引用
              var self = this;
                IDE.socket.emit("getWizardReference", {
                    type: self.domain,
                    event: 'getWizardReference',
                    data: {path: this.path, resourceId: this.resourceId}
                }, function (data) {
                    if (result.state === 'success') {

                    }
                });

            },
            close(){
                this.$el.parentNode.removeChild(this.$el);
            }
        },
        mounted(){
        }
    }
</script>