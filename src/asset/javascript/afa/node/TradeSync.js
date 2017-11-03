//场景同步调用

import {$AG} from "anrajs";
import {refresh, openPropEditor, pinPolicy, idLocation, location} from "../editor/commonOptions";
import * as props from "../propsName";

const defaultPropData = Object.assign({}, props.commonNodeProp, {
    [props.Name]: '场景同步调用',
    [props.Desp]: '场景同步调用',
    [props.Level]: '0',
    [props.Group]: '场景调用组件',
    [props.Sql]: null,
    [props.Type]: '18',
    [props.Target]: 'cn.com.agree.afa.jcomponent.SdkBroker.syncInvoke',
    [props.Style]: '3',
    [props.Tooltip]: '同步使用消费者调用提供者提供的场景',
    [props.Visible]: '1',
    [props.Skip]: {
        [props.Enabled]: '0',
        [props.Branch]: '1',
    },
    [props.Debug]: {
        [props.Codes]: [
            {
                [props.Total]: '0'
            }
        ],
        [props.Result]: '1',
        [props.Return]: null,
        [props.ReturnList]: null,
    },
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '160,46',
    },
    [props.Terminals]: {
        [props.Terminal]: [
            {
                [props.Name]: '0',
                [props.Desp]: '失败',
            },
            {
                [props.Name]: '1',
                [props.Desp]: '成功',
            },
            {
                [props.Name]: '2',
                [props.Desp]: '调用超时',
            }
        ]
    },
    [props.Logic]: {
        [props.Total]: '1',
        [props.RET1]: '3',
    }
});

const defaultEditorData = {
    size: [160,46],
    type: '18',
}

const TradeSync = {
    url: '/assets/image/editor/event_node_component_tradeSync.gif',
    type: $AG.IMAGE,
    size: [160, 44],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['0', '1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    },

    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default TradeSync;