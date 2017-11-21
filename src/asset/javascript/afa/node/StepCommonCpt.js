/*通用组件*/

import {$AG} from "anrajs";
import * as props from "../propsName";
import * as options from "../editor/commonOptions";

let defaultPropData = Object.assign({}, props.commonStepProp, {
    [props.Type]: '5',
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '160,46',
    },
    [props.Desp]: 'DefaultName',
    [props.RefImpl]: 'DefaultName',
    [props.Security]: {
        [props.Readonly]: 0,
        [props.TokenLevel]: 0,
    }
});


const defaultEditorData = {
    size: [160, 46],
    type: '5',
};

const StepCommonCpt = {
    url: '/assets/image/editor/event_component_stepCommonCpt.gif',
    type: $AG.IMAGE,
    anchor: [
        {id: 'N', dir: 'n', offset: 0, ...options.getAnchorOptions('in')},
        {id: '0', dir: 's', offset: -25, ...options.getAnchorOptions('out')},
        {id: '1', dir: 's', offset: 25, ...options.getAnchorOptions('out')},
        {id: 'E', dir: 'e', offset: 0, ...options.getAnchorOptions('in')},
        {id: 'W', dir: 'w', offset: 0, ...options.getAnchorOptions('in')},
    ],
    policies: {
        'doubleclick': options.openPropEditor,

        'despText': $AG.policy.TextPolicy('Desp', options.location),

        'nodeEditor': options.openNodeEditor,

        'pin': options.terminalPolicy(),

        'idText': $AG.policy.TextPolicy('id', options.idLocation),

        'initData': options.initDataPolicy().set(options.SecurityDataHandle),

    },

    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh: options.refresh,
    defaultData: Object.assign({}, defaultEditorData, defaultPropData),
};

export default StepCommonCpt;