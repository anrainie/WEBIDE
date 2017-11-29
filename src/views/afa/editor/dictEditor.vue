<template>
    <editor-Container class="dataDict" :editor="this" :domain="domain">
        <div slot="editor-content">
            <div class="left-side split split-horizontal">
                <el-table border highlight-current-row
                          :data="input.DataDictionary.DataField"
                          @current-change="handleTableClick">
                    <el-table-column prop="-name" label="英文名称" width="140">
                    </el-table-column>
                    <el-table-column prop="-PUBCODECNAME" label="中文名称" width="140">
                    </el-table-column>
                    <el-table-column prop="-type" label="类型">
                    </el-table-column>
                </el-table>
            </div>
            <div class="right-side split split-horizontal">
                <el-form class="detailForm" ref="form" :model="selection" label-width="90px" v-if="selection">
                    <el-col :span="11">
                        <el-form-item label="英文名称">
                            <el-input v-model="selection['-name']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="中文名称">
                            <el-input v-model="selection['-PUBCODECNAME']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="字典大类">
                            <el-select v-model="selection['-DICTTYPE']">
                                <el-option
                                        v-for="item in dictType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="字典子类">
                            <el-input v-model="selection['-APPLYAREA']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="类型">
                            <el-select v-model="selection['-type']">
                                <el-option
                                        v-for="item in types"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="长度">
                            <el-input v-model="selection['-fieldLength']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="字典版本">
                            <el-input v-model="selection['-EDITION']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="字符集">
                            <el-select v-model="selection['-CODINGRULE']">
                                <el-option
                                        v-for="item in codingRules"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="格式化规则">
                            <el-input v-model="selection['-FORMATRULE']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="默认值">
                            <el-input v-model="selection['-default']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="是否枚举">
                            <el-select v-model="selection['-ENUMMUST']">
                                <el-option
                                        v-for="item in enumSets"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="枚举值">
                            <el-input v-model="selection['-PUBCODEVALUE']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="校验文件">
                            <el-input v-model="selection['-VerifyFile']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="校验类型">
                            <el-input v-model="selection['-VerifyType']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="校验表达式">
                            <el-input v-model="selection['-VerifyExpression']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="数据方法">
                            <el-input v-model="selection['-PUBCODECNAME']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item label="描述">
                            <el-input v-model="selection['-description']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="22"></el-col>

                    <el-col :span="11">
                        <el-form-item label="UI域正则">
                            <el-input v-bind:value="getDomain(selection,'ui').Expression"
                                      v-on:input="setDomain(selection,'ui','Expression',$event)">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="错误信息">
                            <el-input v-bind:value="getDomain(selection,'ui').Message"
                                      v-on:input="setDomain(selection,'ui','Message',$event)"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="11">
                        <el-form-item label="IO域正则">
                            <el-input v-bind:value="getDomain(selection,'io').Expression"
                                      v-on:input="setDomain(selection,'io','Expression',$event)"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="错误信息">
                            <el-input v-bind:value="getDomain(selection,'io').Message"
                                      v-on:input="setDomain(selection,'io','Message',$event)"
                            ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="11">
                        <el-form-item label="场景正则">
                            <el-input v-bind:value="getDomain(selection,'service').Expression"
                                      v-on:input="setDomain(selection,'service','Expression',$event)"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="错误信息">
                            <el-input v-bind:value="getDomain(selection,'service').Message"
                                      v-on:input="setDomain(selection,'service','Message',$event)"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
        </div>
    </editor-Container>
</template>
<style scoped>
    .dataDict .left-side{
        display: inline-block;
    }
    .dataDict .right-side{
        display: inline-block;
    }
    .right-side .detailForm{
        margin-top: 25px;
    }

</style>
<script>
    import editorContainer from '../../components/editorContainer.vue'
    import  Split from "split.js";

    export default{
        props: ['file', 'msgHub', 'input','domain'],
        data(){
            return {
                selection:null,
                dirty:false,
                codingRules:[
                    {
                        label:'UTF-8',
                        value:'UTF-8',
                    },
                    {
                        label:'GBK',
                        value:'GBK',
                    },
                ],
                enumSets:[
                    {
                        label:'是',
                        value:'1',
                    },
                    {
                        label:'否',
                        value:'0',
                    }
                ],
                dictType:[
                    {
                        label:'平台',
                        value:'0'
                    },
                    {
                        label:'银行',
                        value:'1'
                    },{
                        label:'应用',
                        value:'2'
                    }
                    ,{
                        label:'产品',
                        value:'3'
                    }
                ],
                types:[
                    {
                        label:'Varchar',
                        value:'String',
                    },
                    {
                        label:'Clob',
                        value:'Clob',
                    },
                    {
                        label:'Blob',
                        value:'Blob',
                    },
                    {
                        label:'Date',
                        value:'Date',
                    },
                    {
                        label:'Time',
                        value:'Time',
                    },
                    {
                        label:'Integer',
                        value:'Integer',
                    },
                    {
                        label:'Double',
                        value:'Double',
                    },
                    {
                        label:'Float',
                        value:'Float',
                    },
                    {
                        label:'bigint',
                        value:'Long',
                    },
                    {
                        label:'Object',
                        value:'Object',
                    },
                ],
            }
        },
        computed: {
        },
        components: {
            editorContainer:editorContainer,
        },
        methods: {
            getDomain(dataField,type){
                for(let i = 0 ; i < dataField.Domain.length ; i++){
                    if(dataField.Domain[i].Type === type){
                        return dataField.Domain[i];
                    }
                }
                return {};
            },
            setDomain(dataField,type,propName,newValue){
                let dm;
                for(let i = 0 ; i < dataField.Domain.length ; i++){
                    if(dataField.Domain[i].Type === type){
                        dm = dataField.Domain[i];
                    }
                }
                if(!dm){
                    dm = {
                        Type:type,
                        Expression:'',
                        Message:'',
                    }
                    dataField.Domain.push(dm);
                }
                dm[propName] = newValue;
            },
            handleTableClick(selection){
                this.selection = selection;
            },
            isDirty(){
                return this.dirty;
            },
            focus(){
            },
            save(){
                return true;
            },
            dirtyStateChange(state){
                this.dirty = state;
            },
            getPartName(){
                if (IDE.navigator == null)
                    return '';
                let item = IDE.navigator.getItem(this.file.path);
                return item.model.label + ' [数据字典]';
            }
        },
        mounted(){
            let $$el = $(this.$el);
            let leftSide = $$el.find(".left-side");
            let rightSide = $$el.find(".right-side");
            Split([leftSide[0], rightSide[0]], {
                direction: 'horizontal',
                sizes: [40, 60]
            });

            this.input.DataDictionary.DataField = this.input.DataDictionary.DataField || [];
            if($.isPlainObject(this.input.DataDictionary.DataField)){
                this.input.DataDictionary.DataField = [this.input.DataDictionary.DataField];
            }

            this.input.DataDictionary.DataField.forEach(function (dataField,index) {
                if(dataField.Domain && $.isPlainObject(dataField.Domain)){
                    dataField.Domain = [dataField.Domain];
                }
            });
        }
    }
</script>