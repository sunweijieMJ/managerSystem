<template>
    <div>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="/">首页</Breadcrumb-item>
                <Breadcrumb-item>分类管理</Breadcrumb-item>
            </Breadcrumb>
        </div>

        <Button-group>
            <Button @click="changeType(1)" :class="{active:formValidate.type==1}">日志分类</Button>
            <Button @click="changeType(2)" :class="{active:formValidate.type==2}">上传分类</Button>
            <Button @click="changeType(3)" :class="{active:formValidate.type==3}">相册分类</Button>
        </Button-group>

        <Tree :data="baseData" @on-select-change="selectChange"></Tree>
        <input type="text" v-model="formValidate.parentId">

        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <Form-item class="nodeTitle" label="名称" prop="title">
                <Input v-model="formValidate.title" placeholder="请输入节点名称"></Input>
            </Form-item>
            <Form-item>
                <Button type="primary" @click="handleSubmit('formValidate')">添加</Button>
                <Button type="warning" @click="editData">修改</Button>
                <Button type="error" @click="remove">删除</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </Form-item>
        </Form>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                baseData: [],
                formValidate: {
                    dataId: null,
                    type: 1, // 默认分类是1
                    title: '',
                    parentId: null,
                    currentParentId: null
                },
                ruleValidate: {
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            this.getData();
        },
        methods: {
            getData(){
                this.$http.get(`http://localhost:3000/cate/${this.formValidate.type}`).then((res) => {
                    this.baseData = res.data;
                })
            },
            selectChange(node){
                if(node.length > 0){
                    // 选择parentId用来添加子分类
                    this.formValidate.parentId = node[0]._id;
                    // 将当前选中数据的_id保存下来
                    this.formValidate.dataId = node[0]._id;
                    // 将当前选中数据的title同步到输入框中
                    this.formValidate.title = node[0].title;
                    // 将当前选中数据的parentId记录下来
                    this.formValidate.currentParentId  = node[0].parentId;
                }
            },
            changeType(type){
                // 改变type值,用来获取不同分类的数据
                this.formValidate.type = type;
                // 根据type值,从数据库筛选数据
                this.getData();
                // 切换数据类型的时候,清空parentId
                this.formValidate.parentId = null;
            },
            editData(){
                // 修改操作的时候将parentId修改掉
                this.formValidate.parentId = this.formValidate.currentParentId;
                // 修改用put方式,将修改数据的id和要修改的数据传过去
                this.$http.put(`http://localhost:3000/cate/data/${this.formValidate.dataId}`,this.formValidate).then((res) => {
                    this.$Message.success('修改成功!');

                    // 以下操作是清空输入框并且保存当前页面
                    let type = this.formValidate.type;
                    Object.assign(this.$data.formValidate, this.$options.data().formValidate);
                    this.formValidate.type = type;
                    this.getData();
                });
            },
            remove(){
                if(!this.formValidate.dataId){
                    this.$Message.success('请选择要删除的数据!');
                    return;
                }

                this.$http.delete(`http://localhost:3000/cate/${this.formValidate.dataId}`).then((res) => {
                    this.$Message.success('删除成功!');

                    // 以下操作是清空输入框并且保存当前页面
                    let type = this.formValidate.type;
                    Object.assign(this.$data.formValidate, this.$options.data().formValidate);
                    this.formValidate.type = type;
                    this.getData();
                })
            },
            handleSubmit (name) {

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // 根据配置向数据库存储数据
                        console.log(this.formValidate)
                        this.$http.post('http://localhost:3000/cate/data',this.formValidate).then((res) => {
                            this.$Message.success('提交成功!');

                            // 将type类型存储下来
                            let type = this.formValidate.type;
                            // 清空parentId,type
                            Object.assign(this.$data.formValidate,this.$options.data().formValidate);
                            // 将type重新赋值回去
                            this.formValidate.type = type;
                            // 根据点击的type类型获取数据
                            this.getData();
                        })
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
<style scoped>
    .nodeTitle{
        margin-top: 20px;
    }
    .active{
        background: #399;
        color:#fff;
    }
</style>