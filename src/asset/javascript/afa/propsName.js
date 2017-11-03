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
}