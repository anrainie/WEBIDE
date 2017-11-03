import {$AG} from "anrajs";
import {refresh, pinPolicy, idLocation, location} from "../editor/commonOptions";
import * as props from "../propsName";

const defaultPropData = Object.assign({}, props.commonNodeProp, {
    [props.Name]: '开始',
    [props.Desp]: '开始',
    [props.Type]: '2',
    [props.Target]: 'Begin',
    [props.Tooltip]: '开始',
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
        [props.RET1]: '2',
    }
});

const defaultEditorData = {
    size: [63, 63],
    type: '2',
}

//开始
const NodeStart = {
    name: 'start',
    desc: '开始',
    url: '/assets/image/editor/event_component_nodeStart.gif',
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
        'pin': pinPolicy(['1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    },
    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default NodeStart;
