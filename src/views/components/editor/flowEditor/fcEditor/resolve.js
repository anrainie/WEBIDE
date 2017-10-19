/*两个函数，分别解析data和line*/

/*用于参数忽略的时候*/
function throwIfMissing() {
    throw new Error('Missing parameter');
}

export var resolveEditorData = function(nodesConfig, modelsConfig = throwIfMissing()) {
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

export var resolveEditorLine = function(nodesConfig) {
    var line = [], {values} = Object, connection;

    try {
        values(nodesConfig).forEach(({Id, SourceConnections}) => {
            if (SourceConnections === null || SourceConnections === undefined) return;

            connection = SourceConnections.Connection;

            if (connection) {
                connection = connection instanceof Array ? connection : [connection];

                connection.forEach((item) => {line.push({
                    //id问题
                    id: Id +　'.' + item.SourceTerminal + '_' + item.TargetId + '.' + item.TargetTerminal,
                    source: Id,
                    type: 0,
                    target: item.TargetId,
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