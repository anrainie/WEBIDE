/**
 * 关于解析后台的流程模型(图)数据
 *
 */
import {leftEditorConfig, rightEditorConfig} from './editorConfig'

/*深复制*/
var deepCopy= function(source) { 

    var result;
    
    if (source instanceof Array) {
        result = [];
        for (var i = 0; i < source.length; i++) {
            result[i] = source[i];
        }
    } else {
        result = {};
        for (var key in source) {
            result[key] = source[key] instanceof Array ? deepCopy(source[key]) : typeof source[key]==='object'? deepCopy(source[key]): source[key];
        }
    }
    
   return result; 
};

var resolveLeftEditor = function(editorConfig, modelConfig) {
    //TODO 错误判断
    var ec = deepCopy(editorConfig),
        mc = deepCopy(modelConfig);
    
    
    //DateInfo
    ec.DateInfo = mc.DateInfo || null;
    
    //NodeMaxnimum
    ec.NodeMaxnimum = mc.NodeMaxnimum || null;
    
    //UUID
    ec.UUID = mc.UUID || null;

    //Regulation
    if (mc.Regulation == null || mc.Regulation.Step == null) {
        return ec;
    }
    
    //Step 里面没有节点是null,只有一个节点的时候是Object，多节点是Array
    var nodes = mc.Regulation.Step, location, size;
    
    ec.data = [];
    ec.line = [];
    
    if (!(nodes instanceof Array) && nodes instanceof Object) {
        nodes = [nodes];
    }
    
    if (nodes.length == 0) {
        return ec;
    }
    
    nodes.forEach(function (item, index, input) {
        location = item.Constraint.Location.split(',');
        //size = item.Constraint.Size.split(',');
        
        size = leftEditorConfig.children[item.Type].size;
        
        ec.data[index] = Object.assign({
            id: item.Id,
            type: item.Type,
            bounds: [parseInt(location[0]), parseInt(location[1]),
                     size[0], size[1]]
        }, item);

        if (item.SourceConnections &&
            item.SourceConnections.Connection) {
            
            //单线为Object
            if (!(item.SourceConnections.Connection instanceof Array)) {
                item.SourceConnections.Connection = [item.SourceConnections.Connection];
            }
            
            item.SourceConnections.Connection.forEach(function (item1, index1, input1) {
                ec.line.push({
                    //id问题 
                    id: item.Id + '_' + item1.targetId,
                    source: item.Id,
                    type: 0,
                    target: item1.targetId,
                    exit: item1.SourceTerminal,
                    entr: item1.TargetTerminal
                });
            });
        }
    });
    
    return ec;
}

var resolveRightEditor = function(editorConfig, modelConfig) {
    var copyEditorCfg = deepCopy(editorConfig),
        copyModelCfg = deepCopy(modelConfig);
    
    if (copyModelCfg == null) {
        return editorConfig;
    }
    
    copyEditorCfg.Usage = copyEditorCfg.Usage;
    
    var nodes = copyModelCfg.Node, location, size;
    
    if (nodes == null) {
        return copyEditorCfg;
    }
    
    copyEditorCfg.data = [];
    copyEditorCfg.line = [];
    
    /*因为单节点是Object类型,多节点是Array类型*/
    if (!(nodes instanceof Array) && nodes instanceof Object) {
        nodes = [nodes];
    }
    
    nodes.forEach(function (item, index, input) {        
        location = item.Constraint.Location.split(',');
        //size = item.Constraint.Size.split(',');
        
        //从已知数据匹配
        size = rightEditorConfig.children[item.Type].size;
        
        copyEditorCfg .data[index] = Object.assign({
            id: item.Id,
            type: item.Type,
            bounds: [parseInt(location[0]), parseInt(location[1]),
                     size[0], size[1]],
        }, item);

        if (item.SourceConnections &&
            item.SourceConnections.Connection) {
            
            //单线为Object
            if (!(item.SourceConnections.Connection instanceof Array)) {
                item.SourceConnections.Connection = [item.SourceConnections.Connection];
            }
            
            item.SourceConnections.Connection.forEach(function (item1, index1, input1) {
                copyEditorCfg.line.push({
                    //id问题 
                    id: item.Id + '_' + item1.targetId,
                    source: item.Id,
                    type: 0,
                    target: item1.targetId,
                    exit: item1.SourceTerminal,
                    entr: item1.TargetTerminal
                });
            });
        }
    });
    
    return copyEditorCfg;
}

export {resolveLeftEditor, resolveRightEditor}