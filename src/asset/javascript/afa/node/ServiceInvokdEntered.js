/*内部场景调用*/

import {$AG} from "anrajs";
import * as options from "../editor/commonOptions";
import * as props from "../propsName"

const defaultPropData = Object.assign({}, props.commonStepProp, {
    [props.Type]: '3',
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '160,60',
    },
    [props.Desp]: '内部场景调用',
    [props.RefImpl]: undefined,
    [props.ToolTip]: '场景同步调用',
    [props.Implementation]: {
        [props.Usage]: '0',
        [props.Node]: undefined,
    }
});

const defaultEditorData = {
    size: [160, 60],
    type: '3',
}


const ServiceInvokdEntered = {
    name: 'service',
    url: '/assets/image/editor/event_component_ServiceInvokdEntered.gif',
    type: $AG.IMAGE,
    anchor: [
        {id: 'N', dir: 'n', offset: 0, ...options.getAnchorOptions('in')},
        {id: '0', dir: 's', offset: -25, ...options.getAnchorOptions('out')},
        {id: '1', dir: 's', offset: 25, ...options.getAnchorOptions('out')},
        {id: 'E', dir: 'e', offset: 0, ...options.getAnchorOptions('in')},
        {id: 'W', dir: 'w', offset: 0, ...options.getAnchorOptions('in')},
    ],
    size: [160, 60],

    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh: options.refresh,

    policies: {
        'doubleclick': options.openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', options.location),
        'nodeEditor': options.closeNodeEditor,
        'pin': options.terminalPolicy(),
        'idText': $AG.policy.TextPolicy('id', options.idLocation)
    },
    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default ServiceInvokdEntered;