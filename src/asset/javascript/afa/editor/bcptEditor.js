import  {manhattanRoute, operations} from "./commonOptions";
import NodeStart from "../node/NodeStart";
import NodeEnd from "../node/NodeEnd";
import NodeAbnormalEnd from "../node/NodeAbnormalEnd";
import NodeCustomEnd from "../node/NodeCustomEnd";
import NodeErrorDelegate from "../node/NodeErrorDelegate";
import ComponentInvoke from "../node/ComponentInvoke";
import TradeInvoke from  "../node/TradeInvoke";
import Transfer from "../node/Transfer";
import TradeSync from "../node/TradeSync";
import Async from "../node/Async";
import Parallel from "../node/Parallel";
import Tcpt from "../node/Tcpt";

const getConfig = (data) => Object.assign(data, {defaultData: undefined});
const getUrl = (url) => `/assets/image/editor/${url}`;

/*node画板配置*/
const nodeDefaultComponent = {
    name: '默认组件',
    items: [
        {
            name: "开始",
            url: getUrl('palette_component_nodeStart.gif'),
            data: NodeStart.defaultData,
        },
        {
            name: "正常结束",
            url: getUrl('palette_component_nodeEnd.gif'),
            data: NodeEnd.defaultData,
        },
        {
            name: "异常结束",
            url: getUrl('palette_component_nodeAbnormalEnd.gif'),
            data: NodeAbnormalEnd.defaultData,
        },
        {
            name: "自定义结束",
            url: getUrl('palette_component_nodeCustomEnd.gif'),
            data: NodeCustomEnd.defaultData,
        },
        {
            name: "默认逻辑错误委托",
            url: getUrl('palette_component_nodeErrorDelegate.gif'),
            data: NodeErrorDelegate.defaultData,
        },
        {
            name: "组件调用",
            url: getUrl('palette_component_ComponentInvoke.gif'),
            data: ComponentInvoke.defaultData,
        },
        {
            name: "内部场景调用",
            url: getUrl('palette_component_TradeInvoke.gif'),
            data: TradeInvoke.defaultData,
        },
        {
            name: "中转节点",
            url: getUrl('palette_component_transfer.gif'),
            data: Transfer.defaultData,
        }
    ],
    group: [
        {
            name: "场景同步调用",
            url: getUrl('palette_component_tradeSync.gif'),
            data: TradeSync.defaultData,
        },
        {
            name: "场景异步调用",
            url: getUrl('palette_component_tradeAsync.gif'),
            data: Async.defaultData,
        },
        {
            name: "平行组件",
            url: getUrl('Parallel.gif'),
            data: Parallel.defaultData,
        }
    ]
}

/*node编辑器配置*/
const NodeBaseCfg = {
    id: 'nodeEditor',
    children: {
        '2': getConfig(NodeStart),
        '3': getConfig(NodeEnd),
        '4': getConfig(NodeAbnormalEnd),
        '14': getConfig(NodeCustomEnd),
        '6': getConfig(NodeErrorDelegate),
        '7': getConfig(ComponentInvoke),
        '12': getConfig(TradeInvoke),
        '10': getConfig(Transfer),
        '18': getConfig(TradeSync),
        '111': getConfig(Async),
        '17': getConfig(Parallel),
        '11': Tcpt,
    },
    lines: {
        0: manhattanRoute
    },
    group: {
        'default': nodeDefaultComponent,
        'platform': {
            name: '平台',
            children: [],
        },
        'bank': {
            name: '银行',
            children: [],
        },
        'application': {
            name: '应用',
            children: [],
        }
    },
    operations
};

export default NodeBaseCfg;