/*平行组件*/

import {$AG} from "anrajs";
import {refresh, openPropEditor, terminalPolicy, idLocation, location} from "../editor/commonOptions";
import * as props from "../propsName";

const defaultPropData = Object.assign({}, props.commonNodeProp, {
    [props.Name]: '并行组件',
    [props.Desp]: '并行组件',
    [props.Level]: '0',
    [props.Type]: '17',
    [props.Target]: 'Parallel',
    [props.Style]: '3',
    [props.Tooltip]: '并行组件',
    [props.Visible]: '1',
    [props.Skip]: {
        [props.Enabled]: '0',
        [props.Branch]: '1',
    },
    [props.Debug]: {
        [props.Codes]: [
            {
                [props.Total]: '0'
            }
        ],
        [props.Result]: '1',
        [props.Return]: null,
        [props.ReturnList]: null,
    },
    [props.Constraint]: {
        [props.Location]: null,
        [props.Size]: '40, 160',
    },
    [props.Terminals]: {
        [props.Terminal]: [
            {
                [props.Name]: '-1',
                [props.Desp]: '成功',
            },
        ]
    },
    [props.OutArgs]: {
        [props.Arg]: [
            {
                [props.Name]: '结果集',
                [props.Key]: 'resultSet',
                [props.Arg]: null,
                [props.Level]: '4',
                [props.Type]: 'cn.com.agree.afa.svc.javaengine.context.JavaDict',
            }
        ]
    },
    [props.IsWaitForResult]: 'true',
    [props.Logic]: {
        [props.Total]: '1',
        [props.RET + '-1']: '3',
    }
});

const defaultEditorData = {
    size: [40, 160],
    type: '17',
}

const Parallel = {
    url: '/assets/image/editor/Parallel_leave.gif',
    type: $AG.IMAGE,
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: '-1', dir: 's', offset: 0},
        {id: 'E', dir: 'e', offset: 0}
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'idText': $AG.policy.TextPolicy('id', idLocation),
        'pin': terminalPolicy({isListen: true}),
    },

    defaultData: Object.assign({}, defaultPropData, defaultEditorData),
}

export default Parallel;