/*技术组件*/

import {$AG} from "anrajs";
import {refresh, openPropEditor, idLocation, location} from "../editor/commonOptions";

const Tcpt = {
    url: "assets/image/editor/event_component_nodeTechnology.gif",
    type: $AG.IMAGE,
    size: [160, 46],
    canDrag: true,
    linkable: true,
    selectable: true,
    anchor: [
        {id: 'N', dir: 'n', offset: 0},
        {id: 'E', dir: 'e', offset: 0},
        {id: 'W', dir: 'w', offset: 0},
    ],
    refresh,

    policies: {
        'doubleclick': openPropEditor,
        'despText': $AG.policy.TextPolicy('Desp', location),
        'idText': $AG.policy.TextPolicy('id', idLocation),
    }
}

export default Tcpt;