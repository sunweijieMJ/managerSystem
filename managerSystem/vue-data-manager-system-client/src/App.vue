<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <template v-if="showLogin">
            <Row type="flex">
                <i-col :span="spanLeft" class="layout-menu-left">
                    <asideBar :iconSize="iconSize"></asideBar>
                </i-col>
                <i-col :span="spanRight">
                    <div class="layout-header">
                        <i-button type="text" @click="toggleClick">
                            <Icon type="navicon" size="32"></Icon>
                        </i-button>
                    </div>
                    <div class="layout-content">
                        <div class="layout-content-main">

                            <router-view></router-view>
                        </div>
                    </div>
                    <footBar></footBar>
                </i-col>
            </Row>
        </template>
        <template v-else>
            <Form class="box" ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <Form-item class="login" prop="name">
                    <Input type="text" v-model="formInline.name" placeholder="Username">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item class="login" prop="password">
                    <Input type="password" v-model="formInline.password" placeholder="Password">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item class="login">
                    <Button type="primary" long @click="handleSubmit('formInline')">登录</Button>
                </Form-item>
            </Form>
        </template>
    </div>
</template>
<script>
    import asideBar from './components/asideBar.vue';
    import headBar from './components/headBar.vue';
    import footBar from './components/footBar.vue';
    import cate from './components/cate.vue';

    import {mapGetters} from 'vuex';
    import md5 from 'crypto-js/md5';

    export default {
        data () {
            return {
                spanLeft: 5,
                spanRight: 19,
                // 表单验证
                formInline: {
                    name: '',
                    password: ''
                },
                ruleInline: {
                    name: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        components: {
            asideBar,headBar,footBar,cate
        },
        mounted(){
            this.$store.dispatch('CHECK_LOGIN',true);
        },
        computed: {
            ...mapGetters([
                'showLogin'
            ]),
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            }
        },
        methods: {
            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // 对密码字段进行md5加密处理
                        this.formInline.password = (md5(this.formInline.password).toString());
                        this.$http.post('http://localhost:3000/user/login',this.formInline).then((res) => {
                            console.log(res.data)
                            if(res.data){
                                 this.$store.dispatch('CHECK_LOGIN',true);
                            }
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: url(http://down1.ppt.downhot.com/pptimages/20170208/gf3hmwgvqyt4434.jpg);
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    .box{
        width: 300px;
        margin:300px auto;
    }
    .login{
        display: block!important;
    }
</style>
