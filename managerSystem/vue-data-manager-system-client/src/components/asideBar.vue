<template>
    <Menu active-name="1" theme="dark" width="auto">
        <div class="layout-logo-left"></div>
        <Menu-item name="1">
            <Icon type="ios-navigate" :size="iconSize"></Icon>
            <span class="layout-text">
                <!-- exact -->
                <router-link to="/home" activeClass="active" exact>首页</router-link>
            </span>
        </Menu-item>
        <Menu-item name="2">
            <Icon type="ios-keypad" :size="iconSize"></Icon>
            <span class="layout-text">
                <router-link to="/user" activeClass="active">用户</router-link>
            </span>
        </Menu-item>
        <Menu-item name="3">
            <Icon type="social-windows" :size="iconSize"></Icon>
            <span class="layout-text">
                <router-link to="/cate" activeClass="active">分类管理</router-link>
            </span>
        </Menu-item>
        <Menu-item name="4">
            <Icon type="ios-analytics" :size="iconSize"></Icon>
            <span class="layout-text">
                <router-link to="/news" activeClass="active">新闻管理</router-link>
            </span>
        </Menu-item>
        <Menu-item name="5">
            <Icon type="ios-gear" :size="iconSize"></Icon>
            <span class="layout-text">
                <router-link to="/upload" activeClass="active">上传管理</router-link>
            </span>
        </Menu-item>
        <Menu-item name="6">
            <Icon type="android-camera" :size="iconSize"></Icon>
            <span class="layout-text">
                <router-link to="/album" activeClass="active">相册管理</router-link>
            </span>
        </Menu-item>
        <Menu-item name="7">
            <Icon type="nuclear" :size="iconSize"></Icon>
            <span class="layout-text">
                <router-link to="/comments" activeClass="active">评论管理</router-link>
            </span>
        </Menu-item>
        <Menu-item name="8">
            <Icon type="ios-close" :size="iconSize"></Icon>
            <span class="layout-text">
                <router-link to="/unLogin" @click="unLogin" activeClass="active">退出登录</router-link>
            </span>
        </Menu-item>
    </Menu>
</template>
<script>
    export default {
        // 收录属性(即接受数据)
        props: ['iconSize'],
        methods: {
            unLogin(){
                this.$store.dispatch('CHECK_LOGIN',false);
            }
        }
    }
</script>
<style scoped>
    .active{
        color: #399;
    }
</style>