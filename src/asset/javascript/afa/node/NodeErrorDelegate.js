import {$AG} from "anrajs";
import * as options from "../editor/commonOptions";
import * as props from "../propsName";

const defaultPropData = Object.assign({}, props.commonNodeProp, {
    [props.Name]: '默认逻辑错误委托',
    [props.Desp]: '默认逻辑错误委托',
    [props.Type]: '6',
    [props.Target]: 'DefaultException',
    [props.Style]: '2',
    [props.Tooltip]: '默认逻辑错误委托',
    [props.Visible]: '1',
    [props.Collapse]: '2',
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '160,46',
    },
    [props.Terminals]: {
        [props.Terminal]: [
            {
                [props.Name]: '0',
                [props.Desp]: '失败',
            },
            {
                [props.Name]: '1',
                [props.Desp]: '成功',
            }
        ]
    },
    [props.Logic]: {
        [props.Total]: '1',
        [props.RET0]: '3',
    }
});

const defaultEditorData = {
    size: [160,46],
    type: '6',
}

//默认逻辑委托错误
const NodeErrorDelegate = {
    name: 'error',
    desc: '默认逻辑错误委托',
    url: '/assets/image/editor/event_component_nodeErrorDelegate.gif',
    type: $AG.IMAGE,
    size: [160, 54],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0, ...options.getAnchorOptions('in')},
        {id: '0', dir: 's', offset: -25, ...options.getAnchorOptions('out')},
        {id: '1', dir: 's', offset: 25, ...options.getAnchorOptions('out')},
        {id: 'E', dir: 'e', offset: 0, ...options.getAnchorOptions('in')},
        {id: 'W', dir: 'w', offset: 0, ...options.getAnchorOptions('in')},
    ],
    refresh: options.refresh,

    policies: {
        'despText': $AG.policy.TextPolicy('Desp', options.location),
        'pin': options.terminalPolicy(),
        'idText': $AG.policy.TextPolicy('id', options.idLocation)
    },

    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
};

export default NodeErrorDelegate;