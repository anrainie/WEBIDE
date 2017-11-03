/*内部场景调用*/

import {$AG} from "anrajs";
import {refresh, openPropEditor, closeNodeEditor, pinPolicy, idLocation, location} from "../editor/commonOptions";
import * as props from "../propsName"

const defaultPropData = Object.assign({}, props.commonStepProp, {
    [props.Type]: '3',
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '160,60',
    },
    [props.Desp]: '内部场景调用',
    [props.RefImpl]: '内部场景调用',
    [props.Implementation]: {
        [props.Usage]: '0',
        [props.Node]: null,
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
        {id: 'N', dir: 'n', offset: 0},
        {id: '0', dir: 's', offset: -25},
        {id: '1', dir: 's', offset: 25},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0}
    ],
    size: [160, 60],

    //特性
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'nodeEditor': closeNodeEditor,
        'pin': pinPolicy(['0', '1']),
        'idText': $AG.policy.TextPolicy('id', idLocation)
    },
    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default ServiceInvokdEntered;