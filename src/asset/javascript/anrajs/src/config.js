module.exports = {
  "Root": {
    "UUID": "4E7CD4FEDCFC4BEFAC64F5C226211435",
    "DateInfo": {
      "CreateDate": "2017-05-04 10:46",
      "ModifyDate": "2017-06-07 09:45"
    },
    "NodeMaxnimum": "60",
    "Regulation": {
      "Step": [
        {
          "UUID": "6BB7D313D4DD4E5CB6104E309449DD41",
          "Quote": "0",
          "Type": "5",
          "Id": "1",
          "Desp": "dfs",
          "RefImpl": "comm",
          "Remarks": "0",
          "Skip": {
            "Enabled": "0",
            "Branch": "1"
          },
          "HasSql": "false",
          "Constraint": {
            "Location": "83,40",
            "Size": "160,46"
          },
          "Security": {
            "Readonly": "62D8718130453374",
            "TokenLevel": "54C0C86AC8028888"
          },
          "SourceConnections": {
            "Connection": [
              {
                "targetId": "2",
                "SourceTerminal": "0",
                "TargetTerminal": "N"
              },
              {
                "targetId": "2",
                "SourceTerminal": "1",
                "TargetTerminal": "E"
              }
            ]
          },
          "Implementation": {
            "Node": [
              {
                "UUID": "E88D32DC3E054B0688C88D8AD25EFB5E",
                "Id": "1",
                "Name": "开始",
                "Desp": "开始",
                "Type": "2",
                "Target": "Begin",
                "Style": "0",
                "Tooltip": "开始",
                "Visible": "null",
                "Collapse": "0",
                "Constraint": {
                  "Location": "38,0",
                  "Size": "63,63"
                },
                "SourceConnections": {
                  "Connection": {
                    "targetId": "2",
                    "SourceTerminal": "1",
                    "TargetTerminal": "N"
                  }
                },
                "Terminals": {
                  "Terminal": {
                    "Name": "1",
                    "Desp": "锚点一"
                  }
                },
                "Logic": {
                  "Total": "1",
                  "RET1": "2"
                }
              },
              {
                "UUID": "2D8C92FDBD58444B9D0636C73DD6A74C",
                "Id": "2",
                "Name": "默认逻辑错误委托",
                "Desp": "默认逻辑错误委托",
                "Type": "6",
                "Target": "DefaultException",
                "Style": "2",
                "Tooltip": "默认逻辑错误委托",
                "Visible": "1",
                "Collapse": "2",
                "Constraint": {
                  "Location": "100,80",
                  "Size": "160,46"
                },
                "SourceConnections": {
                  "Connection": [
                    {
                      "targetId": "3",
                      "SourceTerminal": "0",
                      "TargetTerminal": "N"
                    },
                    {
                      "targetId": "8",
                      "SourceTerminal": "1",
                      "TargetTerminal": "N"
                    }
                  ]
                },
                "Terminals": {
                  "Terminal": [
                    {
                      "Name": "0",
                      "Desp": "失败"
                    },
                    {
                      "Name": "1",
                      "Desp": "成功"
                    }
                  ]
                },
                "Logic": {
                  "Total": "2",
                  "RET0": "3",
                  "RET1": "8"
                }
              },
              {
                "UUID": "31578AC2173644498FC276A3DE73D033",
                "Id": "3",
                "Name": "异常结束",
                "Desp": "异常结束",
                "Type": "4",
                "Target": "END",
                "Style": "0",
                "Tooltip": "异常结束",
                "Visible": "1",
                "Collapse": "0",
                "Constraint": {
                  "Location": "53,300",
                  "Size": "63,63"
                },
                "Logic": { "Total": "0" }
              },
              {
                "UUID": "8620510AC4D046CCBCEAD37D472E9FDB",
                "Ref": "19087B6295954C47BBC9ED4E7ADA0BDD",
                "Id": "4",
                "Name": "动态调用",
                "Desp": "动态调用",
                "Level": "2",
                "Type": "7",
                "Target": "cn.com.agree.afa.jcomponent.bc.BComponentInvoker",
                "FilePath": "/functionModule/businessComponent/projects/dddd/dddd/wwww/tttt.bcpt",
                "Tooltip": "动态调用",
                "Visible": "1",
                "Collapse": "0",
                "Skip": {
                  "Enabled": "0",
                  "Branch": "1"
                },
                "Constraint": {
                  "Location": "440,160",
                  "Size": "160,46"
                },
                "IsError": "0",
                "Terminals": {
                  "Terminal": [
                    {
                      "Name": "0",
                      "Desp": "失败"
                    },
                    {
                      "Name": "1",
                      "Desp": "成功"
                    }
                  ]
                },
                "InArgs": {
                  "Arg": [
                    {
                      "Name": "包名",
                      "Key": "pkgName",
                      "Level": "2"
                    },
                    {
                      "Name": "业务组件名",
                      "Key": "bcName",
                      "Level": "2"
                    }
                  ]
                },
                "Logic": { "Total": "0" }
              },
              {
                "UUID": "77586A3B17634180BAEE700D8633AFF9",
                "Id": "5",
                "Name": "getAllRoles",
                "Desp": "getAllRoles",
                "Type": "12",
                "Target": "cn.com.agree.afa.jcomponent.TradeInvoker.syncInvokePrivTrade",
                "Tooltip": "服务调用",
                "Visible": "1",
                "Collapse": "0",
                "Skip": {
                  "Enabled": "0",
                  "Branch": "1"
                },
                "Constraint": {
                  "Location": "218,220",
                  "Size": "160,46"
                },
                "Async": "0",
                "SourceConnections": {
                  "Connection": {
                    "targetId": "6",
                    "SourceTerminal": "0",
                    "TargetTerminal": "E"
                  }
                },
                "Terminals": {
                  "Terminal": [
                    {
                      "Name": "0",
                      "Desp": "失败"
                    },
                    {
                      "Name": "1",
                      "Desp": "成功"
                    }
                  ]
                },
                "InArgs": {
                  "Arg": [
                    {
                      "Name": "应用代码",
                      "Key": "mc",
                      "Arg": "\"dddd\"",
                      "Level": "4",
                      "Type": "java.lang.String"
                    },
                    {
                      "Name": "服务代码",
                      "Key": "tc",
                      "Arg": "\"getAllRoles\"",
                      "Level": "4",
                      "Type": "java.lang.String"
                    },
                    {
                      "Name": "请求数据",
                      "Key": "requestData",
                      "Level": "0",
                      "Type": "java.lang.Object"
                    },
                    {
                      "Name": "是否切换日志文件",
                      "Key": "switchLogFile",
                      "Level": "4",
                      "Type": "boolean"
                    }
                  ]
                },
                "OutArgs": {
                  "Arg": {
                    "Name": "响应数据",
                    "Key": "responseData",
                    "Level": "0",
                    "Type": "java.lang.Object"
                  }
                },
                "CheckTradeExist": "1",
                "Logic": {
                  "Total": "1",
                  "RET0": "6"
                }
              },
              {
                "UUID": "0945F56E2EE147EAA624B45A774246C3",
                "Id": "6",
                "Name": "正常结束",
                "Desp": "正常结束",
                "Type": "3",
                "Target": "END",
                "Style": "0",
                "Tooltip": "正常结束",
                "Visible": "1",
                "Collapse": "0",
                "Constraint": {
                  "Location": "266,349",
                  "Size": "63,63"
                },
                "Logic": { "Total": "0" }
              },
              {
                "UUID": "80673C89E5C3424597CEC5FD79D9CFED",
                "Id": "7",
                "Name": "中转节点",
                "Desp": "中转节点",
                "Type": "10",
                "Target": "Virtual",
                "Tooltip": "中转节点",
                "Visible": "1",
                "Collapse": "0",
                "Constraint": {
                  "Location": "500,260",
                  "Size": "63,63"
                },
                "Terminals": {
                  "Terminal": {
                    "Name": "1",
                    "Desp": "锚点一"
                  }
                },
                "Logic": { "Total": "0" }
              },
              {
                "UUID": "2BE710AB732F40B5B6B6E27DDBD7FF82",
                "Ref": "E913BA2F906A9F92DB5D42086E6FF07C",
                "Id": "8",
                "Name": "SQL删除数据",
                "Desp": "SQL删除数据",
                "Level": "0",
                "Group": "Hibernate操作类组件",
                "Type": "11",
                "Target": "tc.platform.P_Hibernate.sqlDelete",
                "FilePath": "/functionModule/technologyComponent/platform/registerInfo/Hibernate操作类组件/SQL删除数据.tcpt",
                "Style": "3",
                "Tooltip": "原生SQL删除数据，删除指定条件的记录,其中条件信息的用法为：[[\"COL1\",\"=\",VAL1,\"AND\"],[\"COL2\",\"!=\",VAL2,null]] = COL1=VAL1 AND COL2=VAL2",
                "Skip": {
                  "Enabled": "0",
                  "Branch": "1"
                },
                "IsDebug": "0",
                "Debug": {
                  "Codes": { "Total": "0" },
                  "Result": "1"
                },
                "Constraint": {
                  "Location": "320,62",
                  "Size": "160,46"
                },
                "Async": "0",
                "SourceConnections": {
                  "Connection": [
                    {
                      "targetId": "5",
                      "SourceTerminal": "0",
                      "TargetTerminal": "N"
                    },
                    {
                      "targetId": "4",
                      "SourceTerminal": "1",
                      "TargetTerminal": "W"
                    },
                    {
                      "targetId": "7",
                      "SourceTerminal": "2",
                      "TargetTerminal": "E"
                    }
                  ]
                },
                "Terminals": {
                  "Terminal": [
                    {
                      "Name": "0",
                      "Desp": "失败"
                    },
                    {
                      "Name": "1",
                      "Desp": "成功"
                    },
                    {
                      "Name": "2",
                      "Desp": "异常"
                    }
                  ]
                },
                "InArgs": {
                  "Arg": [
                    {
                      "Name": "指定的Factory名,如果为空则从第一个Factory中获取session",
                      "Key": "factoryName",
                      "Level": "2",
                      "Type": "java.lang.String"
                    },
                    {
                      "Name": "表名String",
                      "Key": "tableName",
                      "Level": "2",
                      "Type": "java.lang.String"
                    },
                    {
                      "Name": "条件的值JavaList，如：[\"列\",\"=\",值]或[[\"列1\",\"=\",值1,\"and\"],[\"列2\",\"<\",值2]]",
                      "Key": "condition",
                      "Level": "2",
                      "Type": "cn.com.agree.afa.svc.javaengine.context.JavaList"
                    },
                    {
                      "Name": "事务提交标识Boolean",
                      "Key": "commitFlg",
                      "Level": "2",
                      "Type": "boolean"
                    }
                  ]
                },
                "OutArgs": {
                  "Arg": {
                    "Name": "删除的行数int",
                    "Key": "rows",
                    "Level": "2",
                    "Type": "int"
                  }
                },
                "AspectUsed": "0",
                "Logic": {
                  "Total": "3",
                  "RET0": "5",
                  "RET1": "4",
                  "RET2": "7"
                }
              }
            ],
            "Usage": "1"
          },
          "Terminals": {
            "Terminal": [
              {
                "Name": "0",
                "Desp": "失败"
              },
              {
                "Name": "1",
                "Desp": "成功"
              }
            ]
          },
          "True": "2",
          "False": "2"
        },
        {
          "UUID": "70200ACC9D174476B22C128B84F218C2",
          "Quote": "1",
          "Type": "3",
          "Id": "2",
          "Name": "createRole",
          "Target": "defaultApp.createRole",
          "Desp": "创建角色",
          "RefImpl": "cn.com.agree.afa.jcomponent.bc.SyncPrivTradeInvoker",
          "Async": "0",
          "ToolTip": "safsadsdgdffhrt",
          "Remarks": "0",
          "Skip": {
            "Enabled": "0",
            "Branch": "1"
          },
          "HasSql": "false",
          "Constraint": {
            "Location": "74,160",
            "Size": "160,46"
          },
          "Security": {
            "Readonly": "36F9D6DA86FB0FF9",
            "TokenLevel": "17AC5427FE44FA43"
          },
          "OutArgs": {
            "Arg": {
              "Name": "响应数据",
              "Key": "responseData",
              "Arg": "ewr",
              "Level": "0"
            }
          },
          "InArgs": {
            "Arg": [
              {
                "Name": "应用代码",
                "Key": "mc",
                "Arg": "\"defaultApp\"",
                "Level": "4",
                "Type": "java.lang.String"
              },
              {
                "Name": "服务代码",
                "Key": "tc",
                "Arg": "\"createRole\"",
                "Level": "4",
                "Type": "java.lang.String"
              },
              {
                "Name": "请求数据",
                "Key": "requestData",
                "Arg": "sdfs",
                "Level": "0",
                "Type": "java.lang.Object"
              },
              {
                "Name": "是否切换日志文件",
                "Key": "switchLogFile",
                "Arg": "dgdfg",
                "Level": "4",
                "Type": "boolean"
              }
            ]
          },
          "SourceConnections": {
            "Connection": [
              {
                "targetId": "3",
                "SourceTerminal": "0",
                "TargetTerminal": "N"
              },
              {
                "targetId": "3",
                "SourceTerminal": "1",
                "TargetTerminal": "E"
              }
            ]
          },
          "Implementation": { "Usage": "0" },
          "Terminals": {
            "Terminal": [
              {
                "Name": "0",
                "Desp": "失败"
              },
              {
                "Name": "1",
                "Desp": "成功"
              }
            ]
          },
          "True": "3",
          "False": "3"
        },
        {
          "UUID": "29E57BD9B1784C8BB544B9C9E9F75544",
          "Ref": "19087B6295954C47BBC9ED4E7ADA0BDD",
          "Quote": "1",
          "Type": "4",
          "Id": "3",
          "Desp": "tttt",
          "Level": "2",
          "RefImpl": "wwww.ttttt",
          "Remarks": "0",
          "FilePath": "/functionModule/businessComponent/projects/dddd/dddd/wwww/tttt.bcpt",
          "HasSql": "false",
          "Constraint": {
            "Location": "91,258",
            "Size": "160,46"
          },
          "Implementation": { "Usage": "0" },
          "Terminals": {
            "Terminal": [
              {
                "Name": "0",
                "Desp": "失败"
              },
              {
                "Name": "1",
                "Desp": "成功"
              }
            ]
          },
          "True": "0",
          "False": "0"
        }
      ]
    }
  }
}