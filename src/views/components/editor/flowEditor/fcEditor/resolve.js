/*两个函数，分别解析data和line*/
import {stepBaseCfg, nodeBaseCfg} from './config'

/*用于参数忽略的时候*/
function throwIfMissing() {
    throw new Error('Missing parameter');
}

var resolveEditorData = function(nodesConfig) {
    let data, location, size;
    let {values, assign} = Object;

    try {
        data = values(nodesConfig).map((node) => {
            location = node.Constraint.Location.split(',');
            size = node.Constraint.Size.split(',');

            return assign({
                id: node.Id,
                type: node.Type,
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

var resolveEditorLine = function(nodesConfig) {
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

/*stepEditor: input to editorConfig*/
export let stepInput2Config = function (input) {

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
            extraConfig.data = resolveEditorData([].concat(input.Root.Regulation.Step), stepBaseCfg.children);
            extraConfig.line = resolveEditorLine([].concat(input.Root.Regulation.Step));
        }

        return Object.assign({}, stepBaseCfg, extraConfig);
    }

    return stepBaseCfg;
}

export let nodeInput2Config = function (input) {
    if (input) {
        let extraConfig = {};

        extraConfig.uuid = input.UUID;

        if (input.Node) {
            extraConfig.data = resolveEditorData([].concat(input.Node), nodeBaseCfg.children);
            extraConfig.line = resolveEditorLine([].concat(input.Node));

            /*???*/
            extraConfig.data.forEach((item) => {
                if (item.type == '11' && item.Target) {
                    item.type = '111';
                }
            });
        }

        return Object.assign({}, nodeBaseCfg, extraConfig);
    }

    return nodeBaseCfg;
}

/*将位置和连线信息更新至taffyDB中*/
export let commonDoSave = function (editor = throwIfMissing()) {
    let nodeStore = editor.store.node,
        lineStore = editor.store.line;

    //更新节点位置
    nodeStore().update(function () {
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
            nodeStore({Id: source}).update({
                SourceConnections: {
                    Connection: [
                        connect
                    ]
                }
            });
        } else {
            let {SourceConnections: {Connection: storeConnect}} = nodeStore({Id: source}).first();

            storeConnect.push(connect);
        }
    });

    editor.cmdStack.markSaveLocation();
};