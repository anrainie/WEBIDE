import {$AG} from 'anrajs'
import {leftEditorConfig, rightEditorConfig} from './editorConfig'

/**
 * 继承$AG.Editor的类库
 *
 */


/**
 * 关于解析后台的流程模型(图)数据
 *
 */
/*用于参数忽略的时候*/
function throwIfMissing() {
    throw new Error('Missing parameter');
}

/*深复制*/
var deepCopy= function(source) {

    let result;

    if (source instanceof Array) {
        result = [];
        for (let i = 0; i < source.length; i++) {
            result[i] = source[i];
        }
    } else {
        result = {};
        for (let key in source) {
            result[key] = source[key] instanceof Array ? deepCopy(source[key]) : typeof source[key]==='object'? deepCopy(source[key]): source[key];
        }
    }

    return result;
};


var resolveEditorData = function(nodesConfig, modelsConfig = throwIfMissing()) {
    let data, location, size;
    let {values, assign} = Object;

    try {
        data = values(nodesConfig).map((node, index) => {
            location = node.Constraint.Location.split(',');
            size = modelsConfig[node.Type].size;

            return assign({
                id: node.Id,
                type: node.Type,
                bounds: [parseInt(location[0]), parseInt(location[1]),
                    size[0], size[1]]
            }, modelsConfig.data, node);
        });
    } catch (e) {
        //todo throw warn
        data = [];
    }

    return data;
};

var resolveEditorLine = function(nodesConfig) {
    var line = [], {values} = Object, connection;

    try {
        values(nodesConfig).forEach(({Id, SourceConnections}) => {
            if (SourceConnections === null || SourceConnections === undefined) return;

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


const arr = ['Skip',
    'Terminals',
    'Type',
    'UUID',
    'Constraint',
    'RefImpl',
    'Remarks',
    'Implementation',
    'False',
    'Desp',
    'Security',
    'Quote',
    'SourceConnections',
    'True',
    'Id',
    'HasSq'];



/*将位置和连线信息更新至taffyDB中*/
let commonDoSave = function () {
    let nodeStore = this.store.node,
        lineStore = this.store.line;

    let editor = this;

    //更新节点位置
    nodeStore().update(function (){
        let {Constraint, bounds, id} = this;
        Constraint.Location = [bounds[0], bounds[1]].toString();
        this.Id = id;
        this.UUID = editor.rootEditPart.model.children[id].hashCode();
        this.Type = this.type;

        return this;
    });

    //更新连线
    nodeStore().update({SourceConnections: undefined});

    lineStore().each(({source, target, exit, entr}) => {
        let hasSourceConnections, connect;

        hasSourceConnections = nodeStore({Id: source}).filter({SourceConnections: {isUndefined: false}}).count() === 1;
        connect = {
            targetId: target,
            SourceTerminal: exit,
            TargetTerminal: entr
        };

        if (!hasSourceConnections) {
            nodeStore({Id: source}).update({SourceConnections:　{
                Connection : [
                    connect
                ]
            }});
        } else {
            let {SourceConnections: {Connection: storeConnect}} = nodeStore({Id: source}).first();

            storeConnect.push(connect);
        }
    });

    this.cmdStack.markSaveLocation();
};


/* *
 *  modelConfig 表示图的数据
 *  setEditorConfig: 构造时可以改变默认的配置
 */
let leftEditor = $AG.Editor.extend({
    editorStore: null,
    constructor(modelConfig, setEditorConfig) {
        this.editorStore = new Map();

        var config = this.resolve(leftEditorConfig, modelConfig);
        if (setEditorConfig && setEditorConfig instanceof Function) {
            setEditorConfig(config);
        }

        $AG.Editor.prototype.constructor.call(this, config);
    },

    createCanvas(id) {
        let canvas = $AG.Editor.prototype.createCanvas.call(this, id);

        //双击事件
        let self = this;
        canvas.element.addEventListener('dblclick', function(e){
            if(e.target.parentNode.isEqualNode(this)) {
                self.rootEditPart.$emit('dblclickCanvs');
            }
            return false;
        });

        return canvas;
    },

    resolve(editorConfig, modelConfig) {
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
    },

    isDirty() {
        var dirty = $AG.Editor.prototype.isDirty.call(this);

        if (dirty || this.editorStore.size == 0) return dirty;

        return this.editorStore.values().reduce((pre, next) => pre | next, dirty);
    },

    doSave() {
        if (this.editorStore.size > 0) {
            this.editorStore.forEach((value, key, map) => {
                if (value.isDirty()) {
                    //暂时只有左边编辑器知道右边的编辑器
                    value.doSave();
                    let imp = key.get('Implementation');
                    imp.Node = value.getSaveData();
                    key.setValue('Implementation', imp);
                }
            })
        }

        commonDoSave.call(this);
    },

    getSaveData(attrs = arr) {
        let nodeStore = this.store.node, result, attrsItem;

        /*遍历DB所有record, 筛选属性数据*/

        result = nodeStore().select.apply(nodeStore(), attrs).map((item) => {
            attrsItem = {};
            for (let [index, elem] of item.entries()) {
                if (elem) {
                    attrsItem[attrs[index]] = elem;
                }
            }

            return attrsItem;
        });

        return result;
    }
});

let rightEditor = $AG.Editor.extend({
    constructor(modelConfig, setEditorConfig) {
        let config = this.resolve(rightEditorConfig, modelConfig);

        if (setEditorConfig && setEditorConfig instanceof Function) {
            setEditorConfig(config);
        }

        $AG.Editor.prototype.constructor.call(this, config);
    },

    createCanvas(id) {
        let canvas = $AG.Editor.prototype.createCanvas.call(this, id);

        //双击事件
        let self = this;
        canvas.element.addEventListener('dblclick', function(e){
            if(e.target.parentNode.isEqualNode(this)) {
                self.rootEditPart.$emit('dblclickCanvs');
            }
            return false;
        });

        return canvas;
    },

    resolve(editorConfig, modelConfig) {
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

            copyEditorCfg.data = resolveEditorData(nodes, editorConfig.children);
            copyEditorCfg.line = resolveEditorLine(nodes)
        }

        return copyEditorCfg;
    },

    doSave: commonDoSave,

    getSaveData(attrs = arr) {
        let nodeStore = this.store.node, result, attrsItem;

        /*遍历DB所有record, 筛选属性数据*/

        result = nodeStore().select.apply(nodeStore(), attrs).map((item) => {
            attrsItem = {};
            for (let [index, elem] of item.entries()) {
                if (elem) {
                    attrsItem[attrs[index]] = elem;
                }
            }

            return attrsItem;
        });

        return result;
    }
});

export const editorClassLib = {
    left : leftEditor,
    right : rightEditor
}