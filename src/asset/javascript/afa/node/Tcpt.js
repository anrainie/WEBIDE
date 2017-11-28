/*技术组件*/

import {$AG} from "anrajs";
import * as options from "../editor/commonOptions";

const Tcpt = {
    url: "assets/image/editor/event_component_nodeTechnology.gif",
    type: $AG.IMAGE,
    size: [160, 46],
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
    }
}

export default Tcpt;