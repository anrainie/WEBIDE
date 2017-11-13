//业务组件

import {$AG} from "anrajs";
import * as options from "../editor/commonOptions";

const Bcpt = {
    url: '/assets/image/editor/event_component_stepBussiness.gif',
    type: $AG.IMAGE,
    size: [160, 46],
    canDrag: true,
    linkable: true,
    selectable: true,
    refresh: options.refresh,
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
    }
}

export default Bcpt;