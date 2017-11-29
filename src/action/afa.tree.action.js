/**
 * Created by zcn on 2017/11/24.
 */
import commonNewWizard from '../views/components/wizards/CommonNewWizard.vue'
import CrateJavaPackageDialog from '../views/components/CreateJavaPackageDialog.vue'
import showCompileErrorMsgDialog from '../views/components/dialog/ShowCompileErrorMsg.vue'
import CreateJavaComponentDialog from '../views/components/CreateJavaComponentDialog.vue'
import showRegisterTcptErrorMsgDialog from '../views/components/dialog/ShowRegisterTcptErrorMsg.vue'
import Vue from 'vue';


module.exports = {
    new:{
        id:'',
        name:'',
        type:'',
        handler:function (selection,item) {
            var newWizard = new Vue(commonNewWizard);
            newWizard.$props.resName = item.name || item.id;
            newWizard.$props.parent = selection.model.path;
            newWizard.$props.resId = item.id;

            var oDiv = document.createElement('div');
            oDiv.id = "wizard";
            document.body.appendChild(oDiv);
            newWizard.$mount('#wizard');
        }
    },
    registAllJavaTCAction:{
        id:'registAllJavaTcAction',
        name:'注册组件',
        type:'item',
        handler:function (selection,item) {
            var self = this;
            var domain = self.items[0].domain;
            IDE.shade.open("正在注册");
            IDE.socket.emit('registJavaTCAction',
                {
                    type: domain,
                    event: 'registJavaTCAction',
                    data: {
                        path: selection[0].model.path
                    }
                }, function (respData) {
                    IDE.shade.hide();
                    if (respData.state === 'success') {
                        self.$notify({
                            title: '提示',
                            message: '注册成功',
                        });
                        selection[0].refresh(3);
                    } else if (respData.state === 'error') {
                        showRegisterTcptError(respData.errorMsg);
                    }
                }
            );
        }
    },
    packTechCptAction:{
        id:'packTechCptAction',
        name:'打包组件',
        type:'item',
        handler:function (selection,item) {

        }
    },
    compileService:{
        id:'compileService',
        name:"编译服务",
        type:'item',
        handler:function (selection,item) {
            var resources = [];
            var self = this;
            var domain = self.items[0].domain;
            if (selection.length > 0) {
                for (let i = 0; i < selection.length; i++) {
                    resources[i] = selection[i].model.path;
                }
                IDE.shade.open("正在编译");
                IDE.socket.emit("compile", {
                    type: domain,
                    path: resources,
                    event: 'compile',
                    resourceType: 'service'
                }, function (result) {
                    IDE.shade.hide();
                    if (result.state === 'success') {
                        self.$notify({
                            title: '编译',
                            message: '编译成功',
                            type: 'success'
                        });
                        for (let i = 0; i < selection.length; i++) {
                            selection[i].refresh(3);
                        }
                    } else if($.isArray(result.errorMsg)){
                        showCompileError(result.errorMsg);
                    }else{
                        self.$notify({
                            title: '编译',
                            message: `编译失败，${result.errorMsg}`,
                            type: 'error'
                        });
                    }
                });
            }
        }
    },
    compileBcpt:{
        id:'compileBcpt',
        name:'编译业务组件',
        type:'item',
        handler:function (selection,item) {
            var that = this;
            var resources = [];
            var domain = that.items[0].domain;
            if (selection.length > 0) {
                for (let i = 0; i < selection.length; i++) {
                    resources[i] = selection[i].model.path;
                }
                IDE.shade.open("正在编译");
                IDE.socket.emit("compile", {
                    type: domain,
                    path: resources,
                    event: 'compile',
                    resourceType: 'bcpt'
                }, function (result) {
                    IDE.shade.hide();
                    if (result.state === 'success') {
                        that.$notify({
                            title: '编译',
                            message: '编译成功',
                            type: 'success'
                        });
                        for (let i = 0; i < selection.length; i++) {
                            selection[i].refresh(3);
                        }
                    } else if($.isArray(result.errorMsg)){
                        showCompileError(result.errorMsg);
                    }else{
                        that.$notify({
                            title: '编译',
                            message: `编译失败，${result.errorMsg}`,
                            type: 'error'
                        });
                    }
                });
            }
        },
        createJavaComponent:{
            id:'createJavaComponent',
            name:'createJavaComponent',
            type:'item',
            handler:function (selection,item) {
                let dialog = new Vue(CreateJavaComponentDialog);
                dialog.$props.parentResource = selection[0];

                let oDiv = document.createElement('div');
                oDiv.id = "wizard";
                document.body.appendChild(oDiv);

                dialog.$mount('#wizard');
                dialog.open();
            }
        }
    },
    createJavaPackage:{
        id:'createJavaPackage',
        name:'新建Java包',
        type:'item',
        handler:function (selection,item) {
            let dialog = new Vue(CrateJavaPackageDialog);
            dialog.$props.parentResource = selection[0];

            let oDiv = document.createElement('div');
            oDiv.id = "wizard";
            document.body.appendChild(oDiv);

            dialog.$mount('#wizard');
            dialog.open();
        }
    },
    createJavaComponnet:{
        id:'createJavaComponnet',
        name:'新建Java技术组件',
        type:'item',
        handler:function (selection,item) {
            let dialog = new Vue(CreateJavaComponentDialog);
            dialog.$props.parentResource = selection[0];

            let oDiv = document.createElement('div');
            oDiv.id = "wizard";
            document.body.appendChild(oDiv);

            dialog.$mount('#wizard');
            dialog.open();
        }
    }
}

function showRegisterTcptError(errorMsgs){
    var newWizard = new Vue(showRegisterTcptErrorMsgDialog);

    var tableData = [];
    for(var index in errorMsgs){
        var errorModel = errorMsgs[index];
        var lineNumber  = errorModel.lineNumber;
        var fileName = errorModel.fileName;
        var functionName = errorModel.functionName;
        var errorMsg = errorModel.errorMsg;
        var newItem = {lineNumber,fileName,functionName,errorMsg};
        tableData.push(newItem);
    }
    newWizard.$props.tableData = tableData;
    var container = document.createElement('div');
    container.id = "registerTcptErrorMsg"
    document.body.appendChild(container);
    newWizard.$mount('#registerTcptErrorMsg');
}


function showCompileError(errorMsgs) {
    var newWizard = new Vue(showCompileErrorMsgDialog);
    newWizard.$props.errorMsgs = errorMsgs;
    var container = document.createElement('div');
    container.id = "compileErrorMsg"
    document.body.appendChild(container);
    newWizard.$mount('#compileErrorMsg');
}
