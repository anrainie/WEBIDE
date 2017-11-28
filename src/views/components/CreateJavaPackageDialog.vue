<template>
    <el-dialog title="新建包" :visible.sync="dialogVisible" @close="close">
        <el-form :model="form">
            <el-form-item label="Package名称" :label-width="labelWidth">
                <el-tooltip manual :content="form.pkgName.error" v-model="nameValid">
                    <el-input v-model="form.pkgName.value" auto-complete="off">
                        <template slot="prepend">{{prefix}}</template>
                    </el-input>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="Package描述" :label-width="labelWidth">
                <el-tooltip manual :content="form.pkgDesp.error" v-model="despValid">
                    <el-input v-model="form.pkgDesp.value" auto-complete="off"></el-input>
                </el-tooltip>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk">确 定</el-button>
        </span>
    </el-dialog>
</template>
<style>

</style>
<script>
    import resKey from '../../utils/resKey';
    import tools from '../../utils/tools';

    export default{
        props:{
            parentResource:{
                type:Object
            }
        },
        computed:{
            nameValid:{
                get:function() {
                    if (this.form.pkgName.error && this.form.pkgName.error.length > 0) {
                        return true;
                    }
                    return false;
                },
                set:function () {

                }
            },
            despValid:{
                get:function () {
                    if(this.form.pkgDesp.error && this.form.pkgDesp.error.length > 0){
                        return true;
                    }
                    return false;
                },
                set:function () {

                }
            },
            prefix(){
                let _package = [];
                let curr = this.parentResource;
                while(curr.model.resId == 'package'){
                    _package.unshift(curr.model.name);
                    curr = curr.getParent();
                }
                switch (this.parentResource.model.level){
                    case 'Platform':
                        if(_package.length > 1)
                            return _package.join('.') +".";
                        return 'tc.platform.';
                    case 'Bank':
                        if(_package.length > 1)
                            return _package.join('.')+".";
                        return 'tc.bank.';
                    case 'App':
                        if(_package.length > 2)
                            return _package.join('.')+".";
                        let project = IDE.navigator.upSearchItem(this.parentResource,resKey.project);
                        let application = IDE.navigator.upSearchItem(this.parentResource,resKey.application);
                        return "tc." + project.model.name + "." + application.model.name + ".";
                    case 'Product':
                        if(_package.length > 2)
                            return _package.join('.')+".";
                        let solution = IDE.navigator.upSearchItem(this.parentResource,resKey.solution);
                        let product = IDE.navigator.upSearchItem(this.parentResource,resKey.product);
                        return "tc." + solution.model.name + "." + product.model.name + ".";
                }
                return ;
            }
        },
        data(){
            return {
                labelWidth: '140px',
                dialogVisible : false,
                form:{
                    pkgName:{
                        value:'',
                        error:'',
                        validator:function (value) {
                            if(value.length < 2){
                                return '名称不能少于2个字符';
                            }else if(value.length > 20){
                                return '名称不能多于20个字符';
                            }else if(tools.isJavaKeyWord(value)){
                                return '不能为Java关键字';
                            }else if(!tools.accordJavaStandard(value)){
                                return '不符合Java标识符规范';
                            }
                        }
                    },
                    pkgDesp:{
                        value:'',
                        error:'',
                        validator:function (value) {
                            if(value.length < 2){
                                return '名称不能少于2个字符';
                            }else if(value.length > 20){
                                return '名称不能多于20个字符';
                            }
                        }
                    }
                }
            }
        },
        methods : {
            open(){
                this.dialogVisible = true;
            },
            validate(){
                let props = Object.getOwnPropertyNames(this.form);
                let accept = true;
                props.forEach( (value,key) => {
                    let prop = this.form[value];
                    if(prop.validator) {
                        prop.error = prop.validator(prop.value);
                        if (prop.error && prop.error.length > 0) {
                            accept = false;
                        }
                    }
                });
                return accept;
            },
            close(){
                this.$el.parentNode.removeChild(this.$el);
            },
            handleOk(){
                if(this.validate()) {
                    var props = Object.getOwnPropertyNames(this.form);
                    props.forEach( (value,key) => {
                        let prop = this.form[value];
                        if(prop.error) {
                            prop.error = '';
                        }
                    });

                    let def =  IDE.socket.emitAndGetDeferred("createJavaPackage",
                        {
                            tyep:IDE.type,
                            parent:this.parentResource.model.path,
                            name:this.prefix + this.form.pkgName.value,
                            desp:this.form.pkgDesp.value
                        }
                    );
                    def.done((result)=>{
                        this.dialogVisible = false;
                        IDE.navigator.refresh(this.parentResource.model.path,8);
                        setTimeout(()=>{
                            this.$destroy();
                        },1000);
                    }).fail((result)=>{
                        this.$notify.error({
                            title: '错误',
                            message: result.errorMsg
                        });
                    });
                }

            }
        }
    }
</script>