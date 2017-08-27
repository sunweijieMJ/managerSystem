<template>
    <div>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="#/">首页</Breadcrumb-item>
                <Breadcrumb-item>上传管理</Breadcrumb-item>
            </Breadcrumb>
        </div>

        <Tree :data="baseData" @on-select-change="selectTreeChange"></Tree>
        <Table stripe :columns="columns1" :data="uploadList" @on-selection-change="selectChange"></Table>
        <Page class="page" :total="filter.total" :page-size="filter.limit" show-sizer @on-change="pageChange" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange"></Page>

        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
                ref="upload"
                name="avatar"
                :show-upload-list="false"
                :default-file-list="list"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                :action="postUrl"
                style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
        <Modal title="查看图片" v-model="visible">
            <img :src="'http://localhost:3000/' + imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    import base from '../common/base';

    export default {
        mixins: [base],
        data () {
            return {
                module: 'upload',
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
                        title: '图片类型',
                        key: 'mimetype',
                        align: 'center'
                    },
                    {
                        title: '路径',
                        key: `path`,
                        align: 'center'
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
                                            this.handleView(params.row);
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
                filter: {
                    cateId: null
                },
                imgName: '',
                visible: false,
                uploadList: [],
                baseData: []
            }
        },
        created(){
            this.getTreeData();
        },
        updated(){
            // this.getImage();
        },
        computed: {
            postUrl(){
                return `http://localhost:3000/upload/filedata/${this.filter.cateId}`;
            }
        },
        methods: {
            getImage(){
                this.uploadList = this.list;
                this.uploadList.forEach((val,index) => {
                    val.url = 'http://localhost:3000/' + val.filename;
                })
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
                    // 获取该分类下的数据
                    this.getData();
                }
            },
            handleView (img) {
                this.imgName = img.filename;
                this.visible = true;
            },
            handleRemove (file) {
                // 从 upload 实例删除数据
                console.log(file);
                this.delData(file._id);
            },
            handleSuccess (res, file) {
                // 因为上传过程为实例，这里模拟添加 url
                file.url = `http://localhost:3000/${res.originalname}`;
                file.name = res.originalname;
                this.uploadList.push(res);
                console.log(res);
                this.uploadList.forEach((val,index) => {
                    val.url = 'http://localhost:3000/' + val.filename;
                    val.status = 'finished';
                    if(val.mimetype.indexOf('/') != -1){
                        val.mimetype = val.mimetype.split('/')[1];
                    }
                    val.date = Date.parse(val.date);
                    let now = new Date(val.date);
                    let y = now.getFullYear();
                    let m = now.getMonth();
                    let d = now.getDate();
                    let hou = now.getHours();
                    let min = now.getMinutes();
                    let sec = now.getSeconds();
                    // 返回时间
                    val.date = `${y}/${m}/${d} ${hou}:${min}:${sec}`;
                });
                console.log(this.uploadList)
                this.getData();
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传 5 张图片。'
                    });
                }
                return check;
            }
        }
    }
</script>
<style scoped>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>