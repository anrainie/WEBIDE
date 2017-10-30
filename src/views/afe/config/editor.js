import planEditor from '../editor/planEditor.vue'
import sqldictEditor from '../editor/sqldictEditor.vue'
import verifyFileEditor from '../editor/verifyFileEditor.vue'
import msgConfigEditor from '../editor/msgConfigEditor.vue'
import dictEditor from '../editor/afeDictEditor.vue'
import mapEditor from '../editor/mapEditor.vue'
import routerConfigEditor from '../editor/routerConfigEditor.vue'

module.exports = {
    pml: planEditor,
    sqldict: sqldictEditor,
    dict:dictEditor,
    rcd:msgConfigEditor,
    rt:routerConfigEditor,
    vtf: verifyFileEditor,
    map:mapEditor,
};

