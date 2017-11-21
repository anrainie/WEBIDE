/*异常结束*/

import {$AG} from "anrajs";
import * as options from "../editor/commonOptions";
import * as props from "../propsName";

const defaultPropData = Object.assign({}, props.commonNodeProp, {
    [props.Name]: '异常结束',
    [props.Desp]: '异常结束',
    [props.Sql]: null,
    [props.Type]: '4',
    [props.Visible]: '1',
    [props.Target]: 'END',
    [props.Tooltip]: '异常结束',
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '63,63',
    },
    [props.Logic]: {
        [props.Total]: '1',
    }
});

const defaultEditorData = {
    size: [63, 63],
    type: '4',
};

const NodeAbnormalEnd = {
    name: 'eend',
    desc: '异常结束',
    url: '/assets/image/editor/event_component_nodeAbnormalEnd.gif',
    type: $AG.IMAGE,
    size: [63, 63],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0, ...options.getAnchorOptions('in')},
        {id: 'E', dir: 'e', offset: 0, ...options.getAnchorOptions('in')},
        {id: 'W', dir: 'w', offset: 0, ...options.getAnchorOptions('in')},
    ],
    refresh: options.refresh,

    policies: {
        'doubleclick': options.openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', options.location),
        'idText': $AG.policy.TextPolicy('id', options.idLocation)
    },

    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default NodeAbnormalEnd;