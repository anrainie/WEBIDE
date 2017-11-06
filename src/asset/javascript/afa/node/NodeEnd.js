import {$AG} from "anrajs";
import {refresh, idLocation, location} from "../editor/commonOptions";
import * as props from "../propsName";

const defaultPropData = Object.assign({}, props.commonNodeProp, {
    [props.Name]: '正常结束',
    [props.Desp]: '正常结束',
    [props.Type]: '3',
    [props.Target]: 'END',
    [props.Tooltip]: '正常结束',
    [props.Visible]: '1',
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
    type: '3',
}
//正常结束
const NodeEnd = {
    name: 'end',
    desc: '结束',
    url: '/assets/image/editor/event_component_nodeEnd.gif',
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
        'despText': $AG.policy.TextPolicy('Desp', location),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    },

    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default NodeEnd;
