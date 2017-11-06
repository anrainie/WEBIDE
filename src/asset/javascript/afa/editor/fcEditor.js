/***** 编辑器配置 *****/

import  {manhattanRoute, operations} from "./commonOptions";
import StepCommonCpt from '../node/StepCommonCpt'
import ServiceInvokdEntered from '../node/ServiceInvokdEntered'
import StepMultiOutletCpt from '../node/StepMultiOutletCpt'
import Bcpt from '../node/Bcpt'

const getConfig = (data) => Object.assign({}, data, {defaultData: undefined});
const getUrl = (url) => `/assets/image/editor/${url}`;

/*step画板配置*/
let stepDefaultComponent = {
    name: '默认组件',
    items: [
        {
            name: "通用组件",
            url: getUrl('palette_component_stepCommonCpt.gif'),
            data: StepCommonCpt.defaultData,
        },
        {
            name: "内部场景调用",
            url: getUrl('palette_component_ServiceInvoke.gif'),
            data: ServiceInvokdEntered.defaultData,
        },
        {
            name: "多出口组件",
            url: getUrl('palette_component_stepMultiOutletCpt.gif'),
            data: StepMultiOutletCpt.defaultData,
        }
    ]
}

/*step编辑器配置*/
export const StepBaseCfg = {
    id: 'stepEditor',
    children: {
        '3': getConfig(ServiceInvokdEntered),
        '5': getConfig(StepCommonCpt),
        '7': getConfig(StepMultiOutletCpt),
        '4': getConfig(Bcpt),
    },
    lines: {
        0: manhattanRoute
    },
    group: {
        "default": stepDefaultComponent,
        "bank": {
            name: '银行',
            children: [],
        },
        "application": {
            name: '应用',
            children: [],
        }
    },
    operations,
};

export default StepBaseCfg;