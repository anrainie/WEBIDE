/*两个函数，分别解析data和line*/
import StepBaseCfg from "./editor/fcEditor";
import NodeBaseCfg from "./editor/bcptEditor";
import * as props from "./propsName";

/*用于参数忽略的时候*/
function throwIfMissing() {
    throw new Error('Missing parameter');
}

const resolveEditorData = function(nodesConfig) {
    let data, location, size;
    let {values, assign} = Object;

    try {
        data = values(nodesConfig).map((node) => {
            location = node[props.Constraint][props.Location].split(',');
            size = node[props.Constraint][props.Size].split(',');

            return assign({
                id: node[props.ID],
                type: node[props.Type],
                bounds: [
                    parseInt(location[0]),
                    parseInt(location[1]),
                    parseInt(size[0]),
                    parseInt(size[1])]
            }, node);
        });
    } catch (e) {
        //todo throw warn
        data = [];
    }
    return data;
};

const resolveEditorLine = function(nodesConfig) {
    var line = [], {values} = Object, connection;

    try {
        values(nodesConfig).forEach(({Id, SourceConnections}) => {
            if (SourceConnections === null || SourceConnections === undefined) return;

            connection = SourceConnections.Connection;

            if (connection) {
                connection = connection instanceof Array ? connection : [connection];

                connection.forEach((item) => {
                    line.push({
                    //id问题
                    id: Id +　'.' + item[props.SourceTerminal] + '_' + item[props.targetId] + '.' + item[props.TargetTerminal],
                    source: Id,
                    type: 0,
                    target: item[props.targetId],
                    exit: item[props.SourceTerminal],
                    entr: item[props.TargetTerminal],
                })})
            }
        })
    } catch(e) {
        line = [];
    }

    return line
}

/*stepEditor: input to editorConfig*/
export const stepInput2Config = function (input) {

    if (input && input.Root) {
        let extraConfig = {};

        try {
            extraConfig.uuid = input.Root.UUID;
            extraConfig.DateInfo = input.Root.DateInfo;
            extraConfig.NodeMaxnimum = input.Root.NodeMaxnimum;
        } catch (e) {
            // TOWARN
        }

        if (input.Root.Regulation && input.Root.Regulation.Step) {
            extraConfig.data = resolveEditorData([].concat(input.Root.Regulation.Step), StepBaseCfg.children);
            extraConfig.line = resolveEditorLine([].concat(input.Root.Regulation.Step));
        }

        return Object.assign({}, StepBaseCfg, extraConfig);
    }

    return StepBaseCfg;
}

export const nodeInput2Config = function (input) {
    if (input) {
        let extraConfig = {};

        extraConfig.uuid = input.UUID;

        if (input.Node) {
            extraConfig.data = resolveEditorData([].concat(input.Node), NodeBaseCfg.children);
            extraConfig.line = resolveEditorLine([].concat(input.Node));

            /*???*/
            extraConfig.data.forEach((item) => {
                if (item.type == '11' && item[props.Target]) {
                    item.type = '111';
                }
            });
        }

        return Object.assign({}, NodeBaseCfg, extraConfig);
    }

    return NodeBaseCfg;
}

/*将位置和连线信息更新至taffyDB中*/
export const commonDoSave = function (editor = throwIfMissing()) {
    let nodeStore = editor.store.node,
        lineStore = editor.store.line;

    //更新节点位置
    nodeStore().update(function () {
        let {bounds, id} = this;
        Object.assign(this, {
            [props.Constraint]: {
                [props.Location]: [bounds[0], bounds[1]].toString(),
                [props.Size]: [bounds[2], bounds[3]].toString()
            },
            [props.ID]: id,
            [props.UUID]: editor.rootEditPart.model.children[id].hashCode(),
            [props.Type]: this.type == '111' ? '11' : this.type
        });

        return this;
    });

    //更新连线 删除原来的数据
    nodeStore().update({SourceConnections: undefined});

    //根据数据库更新SourceConnections属性
    lineStore().each(({source, target, exit, entr}) => {
        let hasSourceConnections, connect;

        hasSourceConnections = nodeStore({[props.ID]: source}).filter({[props.SourceConnections]: {isUndefined: false}}).count() === 1;
        connect = {
            [props.targetId]: target,
            [props.SourceTerminal]: exit,
            [props.TargetTerminal]: entr
        };

        if (!hasSourceConnections) {
            nodeStore({Id: source}).update({
                [props.SourceConnections]: {
                    [props.Connection]: [
                        connect
                    ]
                }
            });
        } else {
            let {[props.SourceConnections]: {[props.Connection]: storeConnect}} = nodeStore({[props.Id]: source}).first();

            storeConnect.push(connect);
        }
    });

    //没有连线则改为空字符串
    nodeStore({[props.SourceConnections]: {isUndefined: true}}).update({[props.SourceConnections]: ""});

    editor.cmdStack.markSaveLocation();
};

export const saveStep = function (step = throwIfMissing(), nodes = throwIfMissing()) {
    step.store.node({
        [props.Type]: ["5", "7", "4"]
    }).each((record) => {
        if (nodes.has(record[props.UUID])) {
            let editor = nodes.get(record[props.UUID]);
            commonDoSave(editor)

            try {
                record[props.Implementation][props.Node] = editor.getSaveData();
            } catch (e) {
                record[props.Implementation] = {
                    Node: editor.getSaveData()
                }
            }
        }
    });
    commonDoSave(step);
    return step.getSaveData();
}

export const saveNode = function (node = throwIfMissing()) {
    commonDoSave(node);
    return node.getSaveData();
}

const nodeVerification = {
    hasAloneNode(editor) {
        let children = Object.values(editor.rootModel.children),
            result = {
                isTrue: true,
                message: '',
            };

        if (children && children.length > 0) {
            for (let child of children) {
                if ((child.sourceLines == null || child.sourceLines.count() == 0) &&
                    (child.targetLines == null || child.targetLines.count() == 0)) {
                    result.isTrue = false;
                    result.message = '孤儿节点\n';
                    break;
                }
            }
        }

        return result;
    },
    hasStartNode(editor) {

        if (editor.store.node().get().length == 0) {
            return {
                isTrue: true,
                message: '',
            };
        }

        return editor.store.node({[props.Type]: {is: '2'}}).get().length == 0 ?
            {
                isTrue: false,
                message: '没有开始节点\n',
            } :
            {
                isTrue: true,
                message: '',
            };
    },
    hasEndNode(editor) {
        if (editor.store.node().get().length == 0) {
            return {
                isTrue: true,
                message: '',
            };
        }

        return editor.store.node({[props.Type]: ['3', '4', '14']}).get().length == 0 ?
            {
                isTrue: false,
                message: '没有结束节点\n',
            } :
            {
                isTrue: true,
                message: '',
            };
    }
};

export const validateNode = function (editor = throwIfMissing()) {
    let result = {
        isTrue: true,
        message: '',
        tooltip: '保存错误',
    };

    Object.values(nodeVerification).reduce((pre, next) => {
        let verification = next(editor);
        pre.isTrue &= verification.isTrue;
        pre.message += verification.message;

        return pre;
    }, result);

    return result;
}

const stepVerification = {
    hasAloneNode(editor) {
        let children = Object.values(editor.rootModel.children) ,
            result = {
                isTrue: true,
                message: '',
            };

        if (children && children.length > 1) {
            for (let child of children) {
                if ((child.sourceLines == null || child.sourceLines.count() == 0) &&
                    (child.targetLines == null || child.targetLines.count() == 0)) {
                    result.isTrue = false;
                    result.message = '孤儿节点\n';
                    break;
                }
            }
        }

        return result;
    }
}

export const validateStep = function (editor = throwIfMissing(), nodeEditors = throwIfMissing()) {
    let result = {
        isTrue: true,
        message: '',
        tooltip: '保存错误',
    };

    for (let item of nodeEditors) {
        let verification = validateNode(item);
        result.isTrue &= verification.isTrue;
        result.message += verification.message;
    }

    Object.values(stepVerification).reduce((pre, next) => {
        let verification = next(editor);
        pre.isTrue &= verification.isTrue;
        pre.message += verification.message;
        return pre;
    }, result);

    return result;
}