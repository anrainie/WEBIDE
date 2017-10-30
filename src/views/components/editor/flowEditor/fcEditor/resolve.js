/*两个函数，分别解析data和line*/
import {stepBaseCfg, nodeBaseCfg} from './config'

/*用于参数忽略的时候*/
function throwIfMissing() {
    throw new Error('Missing parameter');
}

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
                    let targetid = item.TargetId || item.targetId;
                    line.push({
                    //id问题
                    id: Id +　'.' + item.SourceTerminal + '_' + targetid + '.' + item.TargetTerminal,
                    source: Id,
                    type: 0,
                    target: targetid,
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
export let stepInput2Config = function (input = throwIfMissing()) {

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

        return Object.assign({}, stepBaseCfg, extraConfig)
    }

    return stepBaseCfg;
}

export let nodeInput2Config = function (input = throwIfMissing()) {
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

        return Object.assign({}, nodeBaseCfg, extraConfig)
    }

    return nodeBaseCfg;
}