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


var resolveEditorData = function(nodesConfig, modelsConfig) {
    var data, location, size; 
    var {values, assign} = Object;
    
    try {
        data = values(nodesConfig).map((node, index) => {
            location = node.Constraint.Location.split(',');
            size = modelsConfig[node.Type].size;
            
            return assign({
                id: node.Id,
                type: node.Type,
                bounds: [parseInt(location[0]), parseInt(location[1]),
                     size[0], size[1]]
            }, node);
        });
    } catch (e) {
        //todo throw warn
        data = [];
    }
    
    return data;
}

var resolveEditorLine = function(nodesConfig, modelsConfig) {
    var line = [], {values} = Object, connection;
    
    try {
        values(nodesConfig).forEach(({Id, SourceConnections}) => {
            if (SourceConnections == null) return;
            
            connection = SourceConnections.Connection;
            
            if (connection) {
                connection = connection instanceof Array ? connection : [connection];
                
                connection.forEach((item) => {line.push({
                    //id问题 
                    id: Id +　'.' + item.SourceTerminal + '_' + item.targetId + '.' + item.TargetTerminal, 
                    source: Id,
                    type: 0,
                    target: item.targetId,
                    exit: item.SourceTerminal,
                    entr: item.TargetTerminal
                })})
            }
        })
    } catch(e) {
        line = [];
    }
    
    return line
}

var resolveLeftEditor = function (editorConfig, modelConfig) {
    var ec = deepCopy(editorConfig),
        mc = deepCopy(modelConfig),
        nodes;
    
    /*为了减少代码判断*/
    try {
        ({
            Root: {
                DateInfo: ec.DateInfo,
                NodeMaxnimum: ec.NodeMaxnimum,
                UUID: ec.UUID,
                Regulation: {
                    Step: nodes
                }
            }
        } = mc)
    } catch (e) {
        return ec;
    }

    if (nodes) {
        nodes = nodes instanceof Array ? nodes : [nodes];

        ec.data = resolveEditorData(nodes, editorConfig.children);
        ec.line = resolveEditorLine(nodes);
    }

    return ec;
}

var resolveRightEditor = function(editorConfig, modelConfig) {
    var copyEditorCfg = deepCopy(editorConfig),
        copyModelCfg = deepCopy(modelConfig), 
        nodes;
    
    try {
        ({Usage: copyEditorCfg.Usage, Node: nodes} = copyModelCfg);
    } catch(e) {
        return copyEditorCfg;
    }
        
    /*因为单节点是Object类型,多节点是Array类型*/
    
    if (nodes) {
        nodes = nodes instanceof Array ? nodes : [nodes];
        
        copyEditorCfg.data = resolveEditorData(nodes, editorConfig.children)
        copyEditorCfg.line = resolveEditorLine(nodes)
    }
    
    return copyEditorCfg;
}

export {resolveLeftEditor, resolveRightEditor}