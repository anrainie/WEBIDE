//业务组件

import {$AG} from "anrajs";
import {refresh, openPropEditor, openNodeEditor, terminalPolicy, idLocation, location} from "../editor/commonOptions";

const Bcpt = {
    url: '/assets/image/editor/event_component_stepBussiness.gif',
    type: $AG.IMAGE,
    size: [160, 46],
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh,
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

        'pin': terminalPolicy(),
        'idText': $AG.policy.TextPolicy('id', idLocation),
    }
}

export default Bcpt;