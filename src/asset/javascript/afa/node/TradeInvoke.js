//内部场景调用

import {$AG} from "anrajs";
import {refresh, openPropEditor, pinPolicy, idLocation, location} from "../editor/commonOptions";
import * as props from "../propsName";

const defaultPropData = Object.assign({}, props.commonNodeProp, {
    [props.Name]: '内部场景调用',
    [props.Desp]: '内部场景调用',
    [props.Sql]: null,
    [props.Type]: '12',
    [props.Style]: '4',
    [props.Tooltip]: '内部场景调用',
    [props.Visible]: '1',
    [props.Skip]: {
        [props.Enabled]: '0',
        [props.Branch]: '1',
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
            }
        ]
    },
    [props.Logic]: {
        [props.Total]: '1',
        [props.RET0]: '3',
    }
});

const defaultEditorData = {
    size: [160,46],
    type: '12',
}

const TradeInvoke = {
    name: 'serivceX',
    desc: '内部场景调用',
    url: '/assets/image/editor/event_node_component_TradeInvoke.gif',
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
        'idText': $AG.policy.TextPolicy('id', idLocation),
    },
    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default TradeInvoke;