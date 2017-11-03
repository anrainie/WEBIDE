//中转节点

import {$AG} from "anrajs";
import {refresh, openPropEditor, pinPolicy, idLocation, location} from "../editor/commonOptions";
import * as props from "../propsName";

const defaultPropData = Object.assign({}, props.commonNodeProp, {
    [props.Name]: '中转节点',
    [props.Desp]: '中转节点',
    [props.Sql]: null,
    [props.Type]: '10',
    [props.Target]: 'Virtual',
    [props.Tooltip]: '中转节点',
    [props.Visible]: '1',
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '63,63',
    },
    [props.Terminals]: {
        [props.Terminal]: [
            {
                [props.Name]: '1',
                [props.Desp]: '锚点一',
            }
        ]
    },
    [props.Logic]: {
        [props.Total]: '1',
        [props.RET1]: '3',
    }
});

const defaultEditorData = {
    size: [63, 63],
    type: '10',
}


const Transfer = {
    name: 'mid',
    desc: '中转节点',
    url: '/assets/image/editor/event_component_transfer.gif',
    type: $AG.IMAGE,
    size: [63, 63],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '1', dir: 's', offset: 0},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'pin': pinPolicy(['1']),
        'idText': $AG.policy.TextPolicy('id', idLocation),
    },

    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default Transfer;