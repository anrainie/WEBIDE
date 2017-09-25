<template>
    <el-dialog
            :title="wizardtitle"
            :visible.sync="dialogFormVisible"
            :before-close="handleClose">
        <!--<div>{{pagetitle}}</div>-->
        <!--<div>{{pagedesc}}</div>-->
        <el-form>
            <el-form-item :label="namelabel.label" :label-width="labelWidth">
                <el-input :disabled="namelabel.value.length>0" v-model="name" auto-complete="off" :placeholder="namelabel.value">
                    {{name}}
                </el-input>
            </el-form-item>
            <el-form-item v-if="directoryLabel.label" :label="directoryLabel.label" :label-width="labelWidth">
                <el-input v-model="directory" auto-complete="off">{{directory}}</el-input>
            </el-form-item>

            <el-row v-if="groupsLabel">
                <el-col :span="12">
                    <el-form-item :label="groupsLabel" :label-width="labelWidth">
                        <el-select v-model="selectedGroup" placeholder="请选择或输入" filterable allow-create>
                            <el-option v-for="item in groups"
                                       :key="item.value"
                                       :value="item.value"
                                       :label="item.label">

                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col v-if="reference.length>0" :span="12">
                    <el-form-item :label="refLabel" :label-width="labelWidth">
                        <el-select v-model="selectedRef" placeholder="请选择或输入" filterable>
                            <el-option v-for="item in reference"
                                       :key="item.value"
                                       :value="item.value"
                                       :label="item.label">

                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item v-if="desclabel.label" :label="desclabel.label" :label-width="labelWidth">
                <el-input v-model="description" auto-complete="off">{{description}}</el-input>
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
      components: {},
      data() {
            return {
                dialogFormVisible: true,
                //新建：1，修改：2
                    style: 1,
                labelWidth: '140px',
                //资源名
                name: '',
                //描述信息
                description: '',
                //目录
                directory: '',
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
                groupsLabel: '',
                //所在组
                groups: [],
                refLabel: '',
                //引用
                reference: [],
                desclabel: {
                    label: '',
                    value: ''
                },
                directoryLabel: {
                    label: '',
                    value: ''
                },

                selectedGroup: '',
                selectedRef: ''
            }
        },
        methods: {
            handleClose(done){
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });

            },
            handleOk(){
                this.dialogFormVisible = false;
                IDE.socket.emit("createNewResource", {
                    type: IDE.type,
                    event: 'createNewResource',
                    data: {
                        style: this.style,
                        path: this.path,
                        resourceId: this.resourceId,
                        type: this.type,
                        name: this.name == "" ? this.namelabel.value : this.name,
                        description: this.description,
                        directory: this.directory,
                        group: this.selectedGroup,
                        ref: this.selectedRef
                    }
                }, function (result) {
                    if (result) {
                        if (result.state === 'success') {

                            var type = result.data.type;
                            var path = result.data.path;
                            IDE.navigator.refresh(path,1);
                            setTimeout(function () {
                                if (type === 'file') {
                                    let item = IDE.navigator.getItem(path);
                                    let input = result.data.input;
                                    IDE.editorPart.openEditor(item, input);
                                }
                            },700)
                        }
                    }
                });
                //删除dialog
//        var dialog = document.getElementById("wizard")
//        document.body.removeChild(dialog)
            },
            handleChange(value) {
                console.log(value);
            }
        }
    }
</script>