var items = {
    "new": {
        id: "new",
        name: "新建",
        icon: "assets/image/nav-folder.png",
        type: 'group'
    },
    "/project/applicationAction": {
        id: "/project/applicationAction",
        resourceId: "/project/application",
        name: "应用",
        type: "item",
        handler:function () {
            console.info('ddd')
        }
    },
    "/solutionAction": {
        id: "/solutionAction",
        resourceId: "/solution",
        name: "解决方案",
        "type": "item"
    },
    "/projectAction": {
        id: "/projectAction",
        resourceId: "/project",
        name: "项目",
        type: "item"
    },
    "cn.com.agree.ide.afa.index.action.RebuildIndexAction": {
        id: "cn.com.agree.ide.afa.index.action.RebuildIndexAction",
        name: "重构索引",
        type: "item"
    },
    "cn.com.agree.ide.afa.xmlconvert.action.FormatArgAction": {
        id: "cn.com.agree.ide.afa.xmlconvert.action.FormatArgAction",
        name: "导入参数格式化",
        type: "item"
    },
    "cn.com.agree.ide.afa.xmlconvert.action.FormatBcptArgAction": {
        id: "cn.com.agree.ide.afa.xmlconvert.action.FormatBcptArgAction",
        name: "导入参数格式化",
        type: "item"
    },
    "galaxy.ide.configurable.version.control.menu.resourceDeploy": {
        id: "galaxy.ide.configurable.version.control.menu.resourceDeploy",
        name: "版本部署",
        type: "group"
    },
    "galaxy.ide.configurable.version.action.WebDeploy": {
        id: "galaxy.ide.configurable.version.action.WebDeploy",
        name: "Web管理端部署版本",
        type: "item"
    },
    "galaxy.ide.configurable.version.action.OtherDeploy": {
        "id": "galaxy.ide.configurable.version.action.OtherDeploy",
        "name": "其它方式部署版本",
        "type": "item"
    },
    "galaxy.ide.configurable.version.action.UploadDeployPacketAction": {
        id: "galaxy.ide.configurable.version.action.UploadDeployPacketAction",
        name: "上传aar包到Web",
        type: "item"
    },
    "P&roperties": {
        name: "P&roperties",
        type: "item"
    },
    "org.eclipse.ui.DeleteResourceAction": {
        id: "org.eclipse.ui.DeleteResourceAction",
        name: "&Delete",
        type: "item"
    },
    "org.eclipse.ui.RefreshAction": {
        id: "org.eclipse.ui.RefreshAction",
        name: "Re&fresh",
        type: "item"
    },
    "org.eclipse.ui.CopyAction": {
        id: "org.eclipse.ui.CopyAction",
        name: "复制",
        type: "item",
        handler:function () {
            
        }
    }
}

function match(originalItems, newItems) {
    for (let x in originalItems) {
        let oItem = originalItems[x];
        if (oItem.id) {
            let item = items[oItem.id];
            if (item) {
                let newItem = $.extend(true, {}, item);
                newItems.push(newItem);
                if (oItem.children) {
                    newItem.children = [];
                    match(oItem.children, newItem.children);
                }
            }
        }
    }
}

module.exports = {
    items: items,
    match: function (originalItems) {
        var newItems = []
        match(originalItems, newItems);
        return newItems;
    },
    getItem:function (id) {
        var item = items[id];
        if(item){
           return $.extend(true, {}, item)
        }
    }
}