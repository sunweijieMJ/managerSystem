<template>
    <div>
        <Breadcrumb>
            <Breadcrumb-item href="/">首页</Breadcrumb-item>
            <Breadcrumb-item href="#">用户管理</Breadcrumb-item>
        </Breadcrumb>
        <!-- 内容 -->
        <Input class="input" v-model="filter.name">
            <span slot="prepend">请输入关键字</span>
            <Button slot="append" icon="ios-search" @click="search"></Button>
        </Input>
        <Table stripe :columns="columns1" :data="list" @on-selection-change="selectChange"></Table>
        <Page class="page" :total="filter.total" :page-size="filter.limit" show-sizer @on-change="pageChange" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange"></Page>
        <Button type="primary" @click="addData">添加</Button>
        <Button type="error" @click="removes">删除</Button>
        <Modal
                v-model="modal1"
                title="普通的Modal对话框标题"
                @on-ok="ok"
                @on-cancel="cancel">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <Input v-model="formValidate.dataId" placeholder="dataId"></Input>
                <Form-item label="姓名" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
                </Form-item>
                <Form-item label="密码" prop="password">
                    <Input v-model="formValidate.password" type="password" placeholder="请输入密码"></Input>
                </Form-item>
                <Form-item label="邮箱" prop="mail">
                    <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
                </Form-item>
                <Form-item label="城市" prop="city">
                    <Select v-model="formValidate.city" placeholder="请选择所在地">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </Form-item>
                <Form-item label="选择日期">
                    <Row>
                        <Col span="11">
                        <Form-item prop="date">
                            <Date-picker type="date" placeholder="选择日期" v-model="formValidate.date"></Date-picker>
                        </Form-item>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                        <Form-item prop="time">
                            <Time-picker type="time" placeholder="选择时间" v-model="formValidate.time"></Time-picker>
                        </Form-item>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="性别" prop="gender">
                    <Radio-group v-model="formValidate.gender">
                        <Radio label="male">男</Radio>
                        <Radio label="female">女</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="爱好" prop="interest">
                    <Checkbox-group v-model="formValidate.interest">
                        <Checkbox label="吃饭"></Checkbox>
                        <Checkbox label="睡觉"></Checkbox>
                        <Checkbox label="跑步"></Checkbox>
                        <Checkbox label="看电影"></Checkbox>
                    </Checkbox-group>
                </Form-item>
                <Form-item label="介绍" prop="desc">
                    <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    // 引入md5加密依赖包
    import md5 from 'crypto-js/md5';
    import base from '../common/base';

    export default {
        mixins:[base], // 混入
        data () {
            return {
                module: 'user', // 定义该模块名称,mixin使用
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '性别',
                        key: 'gender'
                    },
                    {
                        title: '邮箱',
                        key: 'mail'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editData(params.row);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.delData(params.row._id);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                formValidate: {
                    dataId: '',
                    name: 'swj',
                    password: 123456,
                    mail: 'swj@qq.com',
                    city: 'shanghai',
                    gender: 'male',
                    interest: ['吃饭'],
                    date: '',
                    time: '',
                    desc: 'saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    city: [
                        { required: true, message: '请选择城市', trigger: 'change' }
                    ],
                    gender: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    interest: [
                        { required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change' },
                        { type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change' }
                    ],
                    date: [
                        { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
                    ],
                    time: [
                        { required: true, type: 'date', message: '请选择时间', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请输入个人介绍', trigger: 'blur' },
                        { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
            this.getData();
        },
        computed: {
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            }
        }
    }
</script>
<style>
    .input{
        width: 400px;
        margin-bottom:5px;
    }
    .page{
        margin:5px;
    }
</style>
