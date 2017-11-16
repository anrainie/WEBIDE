<template>
    <div class="ide-entrys">
        <div class="entrys">
            <router-link :to="'afa'" class="entry">
                <span>
                    <p>AFA</p>
                    <el-button type="text" @click="toggleProductArea($event,'afa')">选择产品</el-button>
                </span>
            </router-link>
            <router-link :to="'afe'" class="entry">
               <span>
                    <p>AFE</p>
                    <el-button type="text" @click="toggleProductArea($event,'afe')">选择产品</el-button>
                </span>
            </router-link>
            <div class="productArea">
                <el-table :data="alternativeProducts" style="width:600px;height:200px;left:50%;margin-left:-300px;">
                    <el-table-column property="name" label="名称" width="150"></el-table-column>
                    <el-table-column property="type" label="类型" width="150"></el-table-column>
                    <el-table-column property="ip" label="IP地址" width="200"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template scope="scope">
                            <el-button @click="selectProduct(scope.$index, scope.row)" type="text" size="small">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="product-toolbar">
            <el-button type="text" @click="openServicesDialog()">后台服务编辑</el-button>
        </div>
        <el-dialog title="后台服务列表" custom-class="servicesDialog" :visible.sync="servicesDialogVisible">
            <el-table :data="products">
                <el-table-column property="name" label="名称" width="150"></el-table-column>
                <el-table-column property="type" label="类型" width="150"></el-table-column>
                <el-table-column property="ip" label="IP地址" width="200"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template scope="scope">
                         <el-button @click="clearProduct(scope.$index, scope.row)" type="text" size="small">清理</el-button>
                     </template>
                 </el-table-column>
             </el-table>
         </el-dialog>
     </div>
 </template>
 <style scoped>
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

     .productArea{
         margin-top: 20px;
         width: 100%;
         height: 200px;
         background-color: white;
         opacity: 0.9;
         text-align: center;
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
         margin-top: 20%;
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
                 selectedProduct:null,
                 alternativeProducts:[],
             }
         },
         mounted(){
             this.$productArea = $('.productArea');
             this.$productArea.toggle();
             this.loadAllProduct();
         },
         methods: {
             toggleProductArea($event,type){
                 if(!this.selectedProduct) {
                     this.$productArea.show("slow");
                     this.selectedProduct = type;
                     this.changeAlternativeProducts(type);
                 }else if(this.selectedProduct === type){
                     this.$productArea.hide("slow");
                     this.selectedProduct = null;
                 }else if(this.selectedProduct != type){
                     this.selectedProduct = type;
                     this.changeAlternativeProducts(type);
                 }
                 $event.preventDefault();
             },
             changeAlternativeProducts(type){
                 this.alternativeProducts.splice(0,this.alternativeProducts.length);
                 this.products.forEach((value,index) => {
                     if(value.type === type){
                         this.alternativeProducts.push(value);
                     }
                 })
             },
             selectProduct(index,product){
                 IDE.post('/user/changeProduct',{ideType:this.selectedProduct,pid:product.id}).done( (result) => {
                     this.$notify.success({message:'选择成功', title:'成功'});
                 }).fail((result) => {
                     this.$notify.error({message:result.errorMsg, title:'错误'});
                 });
             },
             openServicesDialog(){
                 this.servicesDialogVisible = true;
             },
             openProductDialog(){
                 this.productDialogVisible = true;
             },
             loadAllProduct(){
                 let self = this;
                 $.post('/product/list',null,function (result) {
                     if(result.state === 'success'){
                         self.products = result.data;
                     }
                 });
             },
             clearProduct(index,product){
                 let self = this;
                 this.$confirm('清理操作会删除服务所有相关信息！', '警告', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                 }).then(function () {
                     $.post('/product/clear',product,function (result) {
                         if(result.state === 'success'){
                             this.$message('清理成功');
                         }else if(result.state === 'error'){
                             this.$alert(result.errorMsg, '错误', {confirmButtonText: '确定'});
                         }
                     });
                 });
             }
         }
     }
 </script>