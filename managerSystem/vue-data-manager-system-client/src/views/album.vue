<template>
    <div>
        <div class="layout-breadcrumb">
        <Breadcrumb>
            <Breadcrumb-item href="#/">首页</Breadcrumb-item>
            <Breadcrumb-item>相册管理</Breadcrumb-item>
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
        <Modal title="查看图片" v-model="visible">
            <img :src="'http://localhost:3000/' + imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
    import base from '../common/base';
    // 引入富文本编辑器
    import { quillEditor } from 'vue-quill-editor'

    export default {
        mixins: [base],
        data() {
            return {
                module: 'upload',
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
                        title: '名称',
                        key: 'originalname',
                        align: 'center'
                    },
                    {
                        title: '上传时间',
                        key: 'date',
                        align: 'center'
                    },
                    {
                        title: '缩略图',
                        key: 'path',
                        align: 'center',
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: `http://localhost:3000/${params.row.filename}`
                                },
                                style: {
                                    width: '50px',
                                    height:'50px',
                                    marginTop:'4px',
                                    cursor:'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.showImage(params.row);
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 120,
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
                                            this.showImage(params.row);
                                        }
                                    }
                                }, '查看'),
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
                visible: false,
                formValidate: {
                    dataId: '',
                    title: '123',
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
                        { type: 'string', min: 20, message: '新闻内容不少于20字', trigger: 'blur' }
                    ],
                }
            }
        },
        created(){
            this.getTreeData();
        },
        methods: {
            showImage (img) {
                this.imgName = img.filename;
                this.visible = true;
            },
            getTreeData(){
                // 获取日志组件的数据
                this.$http.get(`http://localhost:3000/cate/3`).then((res) => {
                    // 将数据放入树形组件中
                    this.baseData = res.data;
                });
            },
            selectTreeChange(node){
                if(node.length > 0){
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