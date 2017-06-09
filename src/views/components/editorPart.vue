<template>
    <div>{{name}}</div>
</template>
<script>
    export  default{
        props: ['name'],
        mounted() {
            console.log('name:', this.$props, this.$data)
        }
    }
</script>