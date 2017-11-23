<template>
    <editor-Container :editor="this" :editoractions="actions">
        <monacoeditor slot="editor-content"
                      :width="width"
                      :height="width"
                      language="java"
                      :code="input"
                      :options="options"
                      @mounted="onMounted"
                      @codeChange="onCodeChange"
                      srcPath=""
        >
        </monacoeditor>
    </editor-Container>
</template>

<script>
    import editorContainer from '../../components/editorContainer.vue'
    import monacoeditor from 'vue-monaco-editor';
    import showRegisterTcptErrorMsgDialog from '../../../views/components/dialog/ShowRegisterTcptErrorMsg.vue';
    import Vue from 'vue';
    const CTRL_CHAR = String.fromCharCode(13);

    // use in component
    export default {
        props: ['input', 'file', 'msgHub', 'domain'],
        data() {
            return {
                options: {
                    selectOnLineNumbers: false,
                    automaticLayout: true,
                },
                width: '100%',
                height: '100%',
                actions:[ {
                  id: "registJavaTCAction",
                  tooltip: "注册组件包",
                  img: "/assets/image/regist_group.gif",
                  handler: this.registJavaTCAction
                }]
            };
        },
        mounted(){

        },
        methods: {
            onMounted(editor) {
                window.java = this;
                let remote = false;
                editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.US_SLASH, (e) => {
                    editor.trigger('triggerSuggest', 'editor.action.triggerSuggest', {});
                    remote = true;
                });
                this.editor = editor;
                monaco.languages.registerCompletionItemProvider('java', {
                    triggerCharacters: ['.'],
                    provideCompletionItems(model, position){
                        if (remote) {
//                            return ['test'];
//                            remote=false;
                        }

                        return new Promise(function (resolve, reject) {
                            Promise.all([
                                {
                                    label: 'simpleText',
                                }, {
                                    label: 'testing',
                                    insertText: {
                                        value: 'testing(${1:condition})'
                                    }
                                }
                            ]).then(function (results) {
                                var suggestions = Array.prototype.concat.apply([
                                    {
                                        label: 'asdfasf',
                                        kind: monaco.languages.CompletionItemKind.Text,
                                    }
                                ], results);
//                                resolve(suggestions);
                            }).catch(err => {
                                reject(err);
                            });
                        });
                    }
                });
            },
            onCodeChange(editor) {
//                console.log(editor.getValue());
            },
            save(){
                return true;
            },
            focus(){

            },
            isDirty(){
                return false;
            },
            dirtyStateChange(){

            },
            getPartName(){
                return this.file.label + ' [技术组件]';
            },
            registJavaTCAction() {
              var self = this;
              IDE.shade.open("正在注册");
              IDE.socket.emit('registJavaTCAction',
                {
                  type: self.domain,
                  event: 'registJavaTCAction',
                  data: {
                    path: self.file.path
                  }
                }, function (respData) {
                  IDE.shade.hide();
                  if (respData.state === 'success') {
                    IDE.navigator.getItem(self.file.path).refresh(3);
                    self.$notify({
                      title: '提示',
                      message: '注册成功',
                    });
                  } else if (respData.state === 'error') {
                    var newWizard = new Vue(showRegisterTcptErrorMsgDialog);

                    var tableData = [];
                    for(var index in respData.errorMsg){
                      var errorModel = respData.errorMsg[index];
                      var lineNumber  = errorModel.lineNumber;
                      var fileName = errorModel.fileName;
                      var functionName = errorModel.functionName;
                      var errorMsg = errorModel.errorMsg;
                      var newItem = {lineNumber,fileName,functionName,errorMsg};
                      tableData.push(newItem);
                    }

                    newWizard.$props.tableData = tableData;
                    var container = document.createElement('div');
                    container.id = "registerTcptErrorMsg"
                    document.body.appendChild(container);
                    newWizard.$mount('#registerTcptErrorMsg');
                  }
                }
              );
            }
            },
        components: {
            monacoeditor,
            editorContainer
        },
    }
</script>