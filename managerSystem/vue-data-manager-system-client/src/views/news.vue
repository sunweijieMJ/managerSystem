<template>
    <div>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="#/">首页</Breadcrumb-item>
                <Breadcrumb-item>新闻管理</Breadcrumb-item>
            </Breadcrumb>
        </div>

        <div class="btns">
            <Input class="search btn" v-model="filter.name">
                <span slot="prepend">请输入关键字</span>
                <Button slot="append" icon="ios-search" @click="search"></Button>
            </Input>
            <Button class="btn" type="info" @click="addData">添加</Button>
            <Button class="btn" type="error" @click="removes">删除</Button>
        </div>

        <Tree :data="baseData" @on-select-change="selectTreeChange"></Tree>
        <Table stripe :columns="columns1" :data="list" @on-selection-change="selectChange"></Table>
        <Page class="page" :total="filter.total" :page-size="filter.limit" show-sizer @on-change="pageChange" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange"></Page>

        <Modal
                v-model="modal1"
                title="普通的Modal对话框标题"
                @on-ok="ok"
                @on-cancel="cancel">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <Input v-model="formValidate.dataId" placeholder="dataId"></Input>
                <Form-item label="分类" prop="cateId">
                        <Input v-model="formValidate.cateId" placeholder="请选择分类"></Input>
                </Form-item>
                <Form-item label="标题" prop="title">
                    <Input v-model="formValidate.title" placeholder="请输入标题"></Input>
                </Form-item>
                <Form-item label="新闻" prop="desc">

                    <!-- 富文本编辑器 -->
                    <quill-editor :content="formValidate.desc"
                                  @change="onEditorChange($event)">
                    </quill-editor>
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
    import base from '../common/base';
    import common from './common.vue';
    // 引入富文本编辑器
    import { quillEditor } from 'vue-quill-editor'

    export default {
        mixins: [base],
        data() {
            return {
                module: 'news',
                baseData: [],
                filter:{
                    cateId:0
                },
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '上传时间',
                        key: 'date',
                        align: 'center'
                    },
                    {
                        title: '评论数',
                        key: 'commentCount',
                        align: 'center'
                    },
                    {
                        title: '描述',
                        key: 'desc',
                        align: 'center'
//                        render: (h, params) => {
//                            return h('p', {
//                                attrs: {
//                                    innerHTML: params.row.desc,
//                                    width: '100px',
//                                    'white-space': 'nowrap',
//                                    overflow: 'hidden',
//                                    'text-overflow': 'ellipsis'
//                                }
//                            })
//                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 150,
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
                                            this.comment(params.row);
                                        }
                                    }
                                }, '评论'),
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
                    title: '',
                    cateId: '',
                    desc: 'desc ssssssssssssssssssss'
                },
                ruleValidate: {
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '分类不能为空', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入新闻内容', trigger: 'blur' },
                        { type: 'string', min: 5, message: '新闻内容不少于5字', trigger: 'blur' }
                    ],
                }
            }
        },
        created(){
            this.getTreeData();
        },
        methods: {
            comment(row){
                this.$router.replace({path:'/common', query:{row:row}});
            },
            getTreeData(){
                // 获取日志组件的数据
                this.$http.get(`http://localhost:3000/cate/1`).then((res) => {
                    // 将数据放入树形组件中
                    this.baseData = res.data;
                });
            },
            selectTreeChange(node){
                if(node[0]._id){
                    // 将模态框中的数据修改为选中数据
                    this.filter.cateId = node[0]._id;
                    this.formValidate.cateId = node[0]._id;
                    // 获取该分类下的数据
                    this.getData();
                }
            },
            onEditorChange({ editor, html, text }) {
                // 将富文本编辑器中的内容同步到formValidate.desc
                this.formValidate.desc = html
            }
        },
        components: {
            quillEditor
        }
    }
</script>

<style lang="scss">
    .btns {
        padding: 10px;
        overflow: hidden;
    }
    .btn{
        margin-right:5px;
        float:left;
    }
    .search{
        width: 400px;
        margin-right:10px;
    }
</style>