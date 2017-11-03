/*通用组件*/

import {$AG} from "anrajs";
import {refresh, openPropEditor, openNodeEditor, pinPolicy, idLocation, location} from "../editor/commonOptions";
import * as props from "../propsName"

let defaultPropData = Object.assign({}, props.commonStepProp, {
    [props.Type]: '5',
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '160,60',
    },
    [props.Desp]: 'DefaultName',
    [props.RefImpl]: 'DefaultName',
});


const defaultEditorData = {
    size: [160, 60],
    type: '5',
}

const StepCommonCpt = {
    url: '/assets/image/editor/event_component_stepCommonCpt.gif',
    type: $AG.IMAGE,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    policies: {
        'doubleclick': openPropEditor,

        'despText': $AG.policy.TextPolicy('Desp', location),

        'nodeEditor': openNodeEditor,

        'pin': pinPolicy(['0', '1']),

        'idText': $AG.policy.TextPolicy('id', idLocation)
    },

    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh,
    defaultData: Object.assign({}, defaultEditorData, defaultPropData),
};

export default StepCommonCpt;