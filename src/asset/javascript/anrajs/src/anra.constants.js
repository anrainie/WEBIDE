export const SELECTED = 0;
/**
 * 反选
 * @type {Number}
 */
export const SELECTED_NONE = 1;
/**
 *
 * @type {Number}
 */
export const SELECTED_PRIMARY = 2;

export const REQ_CONNECTION_START = "connection start";

export const REQ_CONNECTION_END = "connection end";

export const REQ_RECONNECT_SOURCE = "Reconnection source";
export const REQ_CONNECTION_MOD = "connection mod";

export const REQ_RECONNECT_TARGET = "Reconnection target";
export const REQ_MOVE_BENDPOINT = "move bendpoint";
export const REQ_CREATE_BENDPOINT = "create bendpoint";
export const REQ_RESIZE = "resize";
export const REQ_RESIZE_CHILDREN = "resize children";
export const REQ_MOVE = "move";
export const REQ_MOVE_CHILDREN = "move children";
export const REQ_OPEN = "open";
export const REQ_ORPHAN = "orphan";
export const REQ_ORPHAN_CHILDREN = "orphan children";
export const REQ_CREATE = "create child";
export const REQ_ADD = "add children";
export const REQ_CLONE = "clone";
export const REQ_DELETE = "delete";
export const REQ_DELETE_DEPENDANT = "delete dependant";
export const REQ_ALIGN = "align";
export const REQ_ALIGN_CHILDREN = "align children";
export const REQ_DIRECT_EDIT = "direct edit";
export const REQ_SELECTION = "selection";
export const REQ_SELECTION_HOVER = "selection hover";
export const REQ_DRAG_START = 'REQ_DRAG_START';
export const REQ_DRAG_MOVE = 'REQ_DRAG_MOVE';
export const REQ_DRAG_END = 'REQ_DRAG_END';

export const REQ_MOUSE_DOWN = 'REQ_MOUSE_DOWN';
export const REQ_MOUSE_UP = 'REQ_MOUSE_UP';


export const PRE_EXECUTE = 1;
export const PRE_REDO = 2;
export const PRE_UNDO = 4;
export const POST_EXECUTE = 3;

export const ACTION_SELECTION = 0;
export const ACTION_STACK = 1;
export const ACTION_EDITOR = 2;