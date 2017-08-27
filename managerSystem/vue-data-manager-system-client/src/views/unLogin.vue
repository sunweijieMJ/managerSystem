<template>

</template>
<script>

    export default {
        mounted(){
            this.$store.dispatch('CHECK_LOGIN',false);
            this.$router.push('/user');
        }
    }
</script>
