/*声明afa参数名字*/

export const ID = 'Id';
export const UUID = 'UUID';
export const Quote = 'Quote';
export const Type = 'Type';
export const Desp = 'Desp';
export const RefImpl = 'RefImpl';
export const ToolTip = 'ToolTip';
export const Remarks = 'Remarks';
export const Skip = 'Skip';
export const Enabled = 'Enabled';
export const Branch = 'Branch';
export const HasSql = 'HasSql';
export const Constraint = 'Constraint';
export const Location = 'Location';
export const Size = 'Size';
export const Name = 'Name';
export const True = 'True';
export const False = 'False';
export const Terminals = 'Terminals';
export const Terminal = 'Terminal';
export const Security = 'Security';
export const Readonly = 'Readonly';
export const TokenLevel = 'TokenLevel';
export const SourceConnections = 'SourceConnections';
export const Implementation = 'Implementation';
export const Usage = 'Usage';
export const Node = 'Node';
export const Target = 'Target';
export const Style = 'Style';
export const Tooltip = 'Tooltip';
export const Visible = 'Visible';
export const Collapse = 'Collapse';
export const InArgs = 'InArgs';
export const OutArgs = 'OutArgs';
export const Logic = 'Logic';
export const RET1 = 'RET1';
export const Total = 'Total';
export const Sql = 'Sql';
export const Value = 'Value';
export const RET0 = 'RET0';
export const Level = 'Level';
export const Group = 'Group';
export const Debug ='Debug';
export const Codes = 'Codes';
export const Result = 'Result';
export const Return = 'Return';
export const ReturnList = 'ReturnList';
export const RET = 'RET';
export const IsWaitForResult = 'IsWaitForResult';
export const Arg = 'Arg';
export const Key = 'Key';

export const commonStepProp = {
    [ID]: null,
    [UUID]: null,
    [Quote]: '0',
    [Type]: null,
    [Desp]: '',
    [RefImpl]: '0',
    [ToolTip]: '',
    [Remarks]: '',
    [Skip]: {
        [Enabled]: '0',
        [Branch]: '1',
    },
    [HasSql]: 'false',
    [Constraint]: {
        [Location]: null,
        [Size]: null,
    },
    [Terminals]: {
        [Terminal]: [
            {
                [Name]: '0',
                [Desp]: '失败',
            },
            {
                [Name]: '1',
                [Desp]: '成功',
            }
        ]
    },
    [True]: '0',
    [False]: '0',
    [SourceConnections]: null,
};

export const commonNodeProp = {
    [UUID]: null,
    [ID]: null,
    [Name]: null,
    [Desp]: '',
    [Type]: null,
    [Target]: null,
    [Style]: '0',
    [Tooltip]: '',
    [Visible]: null,
    [Collapse]: '0',
    [Constraint]: {
        [Location]: null,
        [Size]: null,
    },
    [SourceConnections]: null,
    [InArgs]: null,
    [OutArgs]: null,
    [Logic]: null,
};

export const inArg = {
    [InArgs]: {
        [Arg]: [
            {
                [Name]: '接出标识',
                [Key]: 'identifier',
                [Arg]: null,
                [Level]: '4',
                [Type]: 'Java.lang.String',
            },
            {
                [Name]: '服务码',
                [Key]: 'serviceCode',
                [Arg]: null,
                [Level]: '4',
                [Type]: 'Java.lang.String',
            },
            {
                [Name]: '服务版本',
                [Key]: 'serviceVersion',
                [Arg]: null,
                [Level]: '4',
                [Type]: 'Java.lang.String',
            },
            {
                [Name]: '场景码',
                [Key]: 'scenarioCode',
                [Arg]: null,
                [Level]: '4',
                [Type]: 'Java.lang.String',
            },
            {
                [Name]: '场景版本',
                [Key]: 'cenarioVersion',
                [Arg]: null,
                [Level]: '4',
                [Type]: 'Java.lang.String',
            },
            {
                [Name]: '入参',
                [Key]: 'params',
                [Arg]: null,
                [Level]: '4',
                [Type]: 'cn.com.agree.afa.svc.javaengine.context.JavaList',
            },
            {
                [Name]: '超时时间，单位毫秒',
                [Key]: 'timeoutInMill',
                [Arg]: null,
                [Level]: '4',
                [Type]: 'long',
            },
            {
                [Name]: '扩展参数',
                [Key]: 'attachment',
                [Arg]: null,
                [Level]: '4',
                [Type]: 'cn.com.agree.afa.svc.javaengine.context.JavaDict',
            },
        ]

    }
};

export const syncOutArg = {
    [OutArgs]: {
        [Arg]: [
            {
                [Name]: '返回结果',
                [Key]: 'result',
                [Arg]: null,
                [Level]: '4',
                [Type]: 'Object',
            }
        ]
    }
};

export const asyncOutArg = {
    [OutArgs]: {
        [Arg]: [
            {
                [Name]: '返回结果',
                [Key]: 'result',
                [Arg]: null,
                [Level]: '4',
                [Type]: 'cn.com.agree.afa.util.future.IFuture',
            }
        ]
    }
};