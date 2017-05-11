<template>
    <div>
        <input type="text" v-model="message"/>

        <router-link :to="'afa'">{{message}}</router-link>
        <router-link :to="'aweb'">AWEB</router-link>

    </div>
</template>

<script>
    export default{
        data(){
            return {
                message: 'Center'
            }
        },
        methods: {
            reverseMessage: function () {
                this.message = this.message.split('').reverse().join('')
            }
        }
    }
</script>