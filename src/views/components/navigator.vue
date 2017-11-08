<script>
    import tree from './tree.vue';

    export default {
        extends: tree,
        methods:{
            upSearchItem(item,resourceId){
                var parent = item.getParent();
                while(true){
                    if(!parent || parent === this){
                        break;
                    }
                    if(parent.model.resId === resourceId){
                        return parent;
                    }
                    parent = parent.getParent();
                }
            },
            downSearchItem(item,resourceId){

            }
        },
        mounted(){
        }
    }
</script>