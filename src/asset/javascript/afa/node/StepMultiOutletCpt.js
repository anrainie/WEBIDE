//多出口组件

import {$AG} from "anrajs";
import * as options from "../editor/commonOptions";
import * as props from "../propsName"

const defaultPropData = Object.assign({}, props.commonStepProp, {
    [props.Type]: '7',
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '160,60',
    },
    [props.Desp]: 'MultiOutlet',
    [props.RefImpl]: 'MultiOutlet',
});

const defaultEditorData = {
    size: [160, 60],
    type: '7',
}

const StepMultiOutletCpt = {
    url: '/assets/image/editor/event_component_stepMultiOutletCpt.gif',
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
        'nodeEditor': options.openNodeEditor,
        'pin': options.terminalPolicy({isListen: true}),
        'idText': $AG.policy.TextPolicy('id', options.idLocation),
        'initData': options.initDataPolicy().set(options.SecurityDataHandle),
    },
    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default StepMultiOutletCpt;