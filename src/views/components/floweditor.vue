<template>
    <div>
        <p>input : {{input}}, file : {{file.model.path}}</p>
        <input type="button" value="save" @click="save"/>
    </div>
</template>
<script type="text/javascript">
    export default {
        name: 'flowEditor',
        props: ['input','file','msgHub'],
        data:function () {
            return {
                dirtyState:true
            }
        },
        methods:{
            isDirty(){
                return this.dirtyState;
            },
            save(){
                this.dirtyStateChange(false);
            },
            dirtyStateChange(dirtyState){
                this.dirtyState = dirtyState;
                this.msgHub.$emit('dirtyStateChange',this.file,this.dirtyState);
            },
            focus(){
                console.info("focus");
            }
        }
    }
</script>

<style>
</style>

