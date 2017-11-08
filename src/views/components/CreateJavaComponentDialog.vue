<template>
    <el-dialog title="新建Java组件" :visible.sync="dialogVisible" @close="close">
        <el-collapse v-model="activeNames">

                <el-collapse-item title="基本信息" name="1">
                    <el-form :model="form">
                        <el-form-item label="包名" :label-width="labelWidth">
                            <el-input v-model="form.pkg.value"></el-input>
                        </el-form-item>
                        <el-form-item label="分组名" :label-width="labelWidth">
                            <el-input v-model="form.category.value"></el-input>
                        </el-form-item>
                        <el-form-item label="类名" :label-width="labelWidth">
                            <el-input v-model="form.clzName.value"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" :label-width="labelWidth">
                            <el-input v-model="form.desp.value"></el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>

            <el-collapse-item title="切面信息" name="2">
                <el-button type="primary">添加</el-button>
                <el-button type="primary">删除<i class="el-icon-delete el-icon--right"></i></el-button>
                <el-table :data="form.acpects.value" style="width: 100%">
                    <el-table-column
                            prop="clzName"
                            label="类名"
                            width="250">
                    </el-table-column>
                    <el-table-column
                            prop="methodName"
                            label="方法名">
                    </el-table-column>
                </el-table>
            </el-collapse-item>

        </el-collapse>

    </el-dialog>
</template>
<style>

</style>
<script>
    import resKey from '../../utils/resKey';

    export default{
        props: {
            parentResource: {
                type: Object
            }
        },
        computed:{
            pkgPrefix(){
                var prefix = [];
                prefix.unshift(this.parentResource.model.name);
                var parent = IDE.navigator.upSearchItem(this.parentResource,resKey.package);
                while(parent){
                    prefix.unshift(parent.model.name);
                    parent = IDE.navigator.upSearchItem(parent,resKey.package);
                }
                switch (this.parentResource.model.level){
                    case 'Platform':
                        if(prefix.length < 2){
                            prefix = ['tc','platfrom'];
                        }
                        break;
                    case 'Bank':
                        if(prefix.length < 2){
                            prefix = ['tc','bank'];
                        }
                        break;
                    case 'App':
                        if(prefix.length < 3) {
                            let project = IDE.navigator.upSearchItem(this.parentResource, resKey.project);
                            let application = IDE.navigator.upSearchItem(this.parentResource, resKey.application);
                            prefix = ['tc',project.model.name,application.model.name];
                        }
                        break;
                    case 'Product':
                        if(prefix.length < 3) {
                            let solution = IDE.navigator.upSearchItem(this.parentResource, resKey.solution);
                            let product = IDE.navigator.upSearchItem(this.parentResource, resKey.product);
                            prefix = ['tc',solution.model.name,product.model.name];
                        }
                        break;
                }
                return prefix.join(".");
            }
        },
        data(){
            return {
                activeNames: ['1'],
                labelWidth: '70px',
                dialogVisible: false,
                form: {
                    pkg: {
                        value: this.pkgPrefix
                    },
                    category: {
                        value: ''
                    },
                    clzName: {
                        value: ''
                    },
                    desp: {
                        value: ''
                    },
                    acpects: {
                        value: []
                    }
                }
            }
        },
        methods: {
            open(){
                this.dialogVisible = true;
            },
            close(){

            }
        },
        mounted(){
            this.form.pkg.value = this.pkgPrefix;
        }
    }
</script>
