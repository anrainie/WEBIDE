<template>
    <div class="ide-entrys">
        <div class="entrys">
            <router-link :to="'afa'" class="entry">
                <p>AFA</p>
            </router-link>
            <router-link :to="'afe'" class="entry">
                <p>AFE</p>
            </router-link>
        </div>
        <div class="product-toolbar">
            <el-button type="text" @click="openServicesDialog()">后台服务编辑</el-button>
        </div>
        <el-dialog title="后台服务列表" custom-class="servicesDialog" :visible.sync="servicesDialogVisible">
            <el-button style="float: right;margin-bottom: 5px;margin-right: 5px;" type="text" @click="openProductDialog()">新增</el-button>
            <el-table :data="products">
                <el-table-column property="name" label="名称" width="150"></el-table-column>
                <el-table-column property="type" label="类型" width="150"></el-table-column>
                <el-table-column property="ip" label="IP地址" width="200"></el-table-column>
                <el-table-column property="port" label="端口" width="100"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template scope="scope">
                        <el-button @click="modifyProduct(scope.$index, scope.row)" type="text" size="small">修改
                        </el-button>
                        <el-button @click="delProduct(scope.$index, scope.row)" type="text" size="small">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog titile="填写后台服务信息" size="tiny" :visible.sync="productDialogVisible">
            <el-form :model="productForm" label-width="60px">
                <el-form-item label="名称">
                    <el-input v-model="productForm.name"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="productForm.type" placeholder="请选择服务类型">
                        <el-option label="AFA" value="afa"></el-option>
                        <el-option label="AFE" value="afe"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="IP地址">
                    <el-input v-model="productForm.ip"></el-input>
                </el-form-item>
                <el-form-item label="port">
                    <el-input v-model="productForm.port"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="resetProductDialog">取 消</el-button>
                    <el-button type="primary" @click="addProduct">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style>
    .ide-entrys{
        width: 100%;
        height: 100%;
        text-align: center;
        background-image: url("~assets/image/center-bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .entrys {
        position: relative;
        top: 20%;
    }

    .entry {
        display: inline-block;
        width: 200px;
        height: 200px;
        text-align: center;
        background-color: rgb(158, 168, 181);
        margin-left: 20px;
        border-radius: 10px;
        opacity: 0.7;
        text-decoration: none;
    }
    .product-toolbar{
        position: relative;
        top:25%
    }

    .entry:hover {
        opacity: 1.0;
    }

    .entry p {
        position: relative;
        top: 30%;
        color: black;
        text-decoration: none;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 300;
        font-size: 50px;
    }

    .servicesDialog{
        width: 60%;
    }
</style>
<script>
    export default{
        data: function () {
            return {
                servicesDialogVisible:false,
                productDialogVisible:false,
                products:[],
                productForm:{
                    name:null,
                    type:null,
                    ip:null,
                    port:null,
                    modify:false
                }
            }
        },
        methods: {
            openServicesDialog(){
                this.servicesDialogVisible = true;
                this.loadAllProduct();
            },
            openProductDialog(){
                this.productDialogVisible = true;
            },
            resetProductDialog(){
                this.productDialogVisible = false;
                this.productForm = {
                    name:null,
                    type:null,
                    ip:null,
                    port:null,
                    modify:false
                }
            },
            addProduct(){
                var self = this;
                if(this.productForm.modify){
                    this.$confirm('更新操作会重启系统内部服务！', '警告', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(function(){
                        $.post('/product/update',self.productForm,function (result) {
                            if(result.state === 'success'){
                                self.loadAllProduct();
                            }else{
                                self.$notify.error({
                                    title: '提示',
                                    message: '更新失败'
                                });
                            }
                            self.resetProductDialog();
                        });
                    });
                }else {
                    $.post('/product/add', this.productForm, function (result) {
                        self.resetProductDialog();
                        if (result.state === 'success') {
                            self.$notify({
                                title: '提示',
                                message: '添加成功'
                            });
                            self.loadAllProduct();
                        } else if (result.state === 'error') {
                            self.$notify({
                                title: '提示',
                                message: '添加失败：' + result.errorMsg
                            });
                        }
                        self.resetProductDialog();
                    });
                }
            },
            loadAllProduct(){
                let self = this;
                $.post('/product/list',null,function (result) {
                    if(result.state === 'success'){
                        self.products = result.data;
                    }
                });
            },
            modifyProduct(index,product){
                let self = this;
                this.openProductDialog();
                this.productForm = product;
                this.productForm.modify = true;
            },
            delProduct(index,product){
                let self = this;
                this.$confirm('删除操作会删除服务所有相关信息！', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    $.post('/product/del',product,function (result) {
                        if(result.state === 'success'){
                            self.loadAllProduct();
                        }
                    });
                });
            }
        }
    }
</script>