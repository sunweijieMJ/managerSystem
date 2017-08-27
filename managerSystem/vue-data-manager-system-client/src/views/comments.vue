<template>
    <div>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="#/">首页</Breadcrumb-item>
                <Breadcrumb-item>评论中心</Breadcrumb-item>
            </Breadcrumb>
        </div>

        <div class="btns">
            <Input class="search btn" v-model="filter.name">
            <span slot="prepend">请输入关键字</span>
            <Button slot="append" icon="ios-search" @click="search"></Button>
            </Input>
            <Button class="btn" type="error" @click="removes">删除多个</Button>
        </div>

        <Table stripe :columns="columns1" :data="list" @on-selection-change="selectChange"></Table>
        <Page class="page" :total="filter.total" :page-size="filter.limit" show-sizer @on-change="pageChange" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange"></Page>

        <Modal
                v-model="modal1"
                title="普通的Modal对话框标题"
                @on-ok="ok"
                @on-cancel="cancel">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <Form-item label="标题" prop="title">
                    <Input v-model="formValidate.title" placeholder="请输入标题"></Input>
                </Form-item>
                <Form-item label="新闻" prop="textarea">

                    <!-- 富文本编辑器 -->
                    <quill-editor :content="formValidate.textarea"
                                  @change="onEditorChange($event)">
                    </quill-editor>
                    <Row>
                        <i-col span="12">
                            <Rate show-text v-model="formValidate.valueText"></Rate>
                        </i-col>
                    </Row>
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
    // 引入富文本编辑器
    import { quillEditor } from 'vue-quill-editor'

    export default {
        mixins: [base],
        data() {
            return {
                module: 'common',
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
                        title: '评分',
                        align: 'center',
                        render: (h, params) => {
                            return h('Rate', {
                                attrs: {
                                    disabled: '',
                                    'allow-half' : '',
                                    value : params.row.valueText
                                }
                            })
                        }
                    },
                    {
                        title: '内容',
                        key: 'textarea',
                        align: 'center'
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
                                            this.commentChange(params.row);
                                        }
                                    }
                                }, '修改'),
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
                    valueText: 0,
                    textarea: 'desc ssssssssssssssssssss'
                },
                ruleValidate: {
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                    valueText: [
                        { required: true, message: '评分不能为空', trigger: 'blur' }
                    ],
                    textarea: [
                        { required: true, message: '请输入评论内容', trigger: 'blur' },
                        { type: 'string', min: 5, message: '评论内容不少于5字', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            onEditorChange({ editor, html, text }) {
                // 将富文本编辑器中的内容同步到formValidate.textarea
                this.formValidate.textarea = html
            },
            commentChange(row){
                this.modal1 = true;
                this.formValidate = row;
                this.formValidate.dataId = row._id;
            },
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