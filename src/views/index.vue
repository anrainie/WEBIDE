<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                message: 'Hello Vue.js!'
            }
        },
        mounted(){
        },
        methods: {
            reverseMessage: function () {
                this.message = this.message.split('').reverse().join('')
            }
        }
    }
</script>