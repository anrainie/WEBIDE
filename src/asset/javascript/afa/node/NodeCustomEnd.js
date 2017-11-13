import {$AG} from "anrajs";
import * as options from "../editor/commonOptions";
import * as props from "../propsName";

const defaultPropData = Object.assign({}, props.commonNodeProp, {
    [props.Name]: '自定义结束',
    [props.Desp]: '自定义结束',
    [props.Type]: '14',
    [props.Visible]: '1',
    [props.Target]: 'END',
    [props.Tooltip]: '自定义结束',
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '63,63',
    },
    [props.Value]: '2',
    [props.Logic]: {
        [props.Total]: '0',
    }
});

const defaultEditorData = {
    size: [63, 63],
    type: '14',
};

/*自定义结束*/
const NodeCustomEnd = {
    url: '/assets/image/editor/event_component_nodeCustomEnd.gif',
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
        'idText': $AG.policy.TextPolicy('id', options.idLocation),
    },

    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default NodeCustomEnd;