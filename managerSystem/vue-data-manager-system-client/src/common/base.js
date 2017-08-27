// 引入md5加密依赖包
import md5 from 'crypto-js/md5';

export default {
    data () {
        return {
            ids: [], // 多选操作时记录id
            pageSizeOpts: [5,10,15,20],
            list: [],// table表格显示的数据列表
            filter: { // 过滤操作(页码,总页数,总记录,每页显示的记录数)
                total: 0,
                pages: 1,
                page: 0,
                limit: 0,
                name: '' // 根据名称搜索
            },
            modal1: false,
        }
    },
    mounted(){
        this.getData();
    },
    methods: {
        getData(){
            // 根据filter限定,向数据库请求数据进行分页
            this.$http.post(`http://localhost:3000/${this.module}/list`,this.filter).then((res) => {
                this.list = res.data.docs;
                this.list.forEach((val,index) => {
                    if(val.date){
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
                    }
                    if(val.mimetype){
                        val.mimetype = val.mimetype.split('/')[1];
                    }
                });
                this.filter.total = res.data.total;
                this.filter.pages = res.data.pages;
                this.filter.page = res.data.page;
                this.filter.limit = res.data.limit;
            });
        },
        search(){
            // input框的value值和filter.name双向绑定,所有可以直接搜索
            this.getData();
        },
        pageChange(page){
            // 翻页改变filter.page
            this.filter.page = page;
            this.getData();
        },
        pageSizeChange(pageSize){
            // 翻页改变filter.limit
            this.filter.limit = pageSize;
            this.getData();
        },
        addData(){
            this.modal1 = true;
        },
        delData(id){
            this.$http.delete(`http://localhost:3000/${this.module}/data/`+id).then(res=>{
                this.getData();
            });
        },
        editData(row){
            this.modal1 = true;
            this.formValidate = row;
            // 将数据库传过来的日期对象(String类型)转换为对象
            this.formValidate.date = new Date(this.formValidate.date);
            this.formValidate.dataId = row._id;
        },
        selectChange(selection){
            let selLen = selection.length;
            if(selection && selLen > 0){
                let ids = [];
                for(let i = 0; i < selLen; i++){
                    ids.push(selection[i]._id);
                }
                this.ids = ids;
                console.log(this.ids);
            }
        },
        removes(){
            if(this.ids.length > 0){
                this.$Modal.confirm({
                    title: '确认列表数据',
                    content: '<b>确认删除数据</b>',
                    onOk: () => {
                        // 点击确认的回调函数,向数据库请求删除数据
                        this.$http.post(`http://localhost:3000/${this.module}/removes`,{ids:this.ids}).then((res) => {
                            this.$Message.info('删除成功');
                            this.getData();
                        })
                    },
                    onCancel: () => {
                        // 点击取消的回调函数
                        this.$Message.info('删除数据失败');
                    }
                });
            } else {
                // 没有选择任何数据
                this.$Message.info('请选择数据');
            }
        },
        ok () {
            this.$Message.info('点击了确定');
        },
        cancel () {
            this.$Message.info('点击了取消');
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // 对密码字段进行md5加密处理
                    this.formValidate.password = (md5(this.formValidate.password).toString());

                    // 判断是否有dataId,如果有则是修改
                    if(this.formValidate.dataId.trim().length > 0){
                        this.$http.put(`http://localhost:3000/${this.module}/data/`+this.formValidate.dataId,this.formValidate).then((res) => {
                            this.$Message.success('修改成功!');
                            this.modal1 = false;
                            this.getData();

                            // 将时间格式转换为对象

                            Object.assign(this.$data.formValidate, this.$options.data().formValidate);
                        })

                        // 如果没有dataId则是新增
                    } else {
                        this.$http.post(`http://localhost:3000/${this.module}/data`,this.formValidate).then((res) => {
                            this.$Message.success('提交成功!');
                            this.modal1 = false;
                            this.getData();

                            Object.assign(this.$data.formValidate, this.$options.data().formValidate);
                        })
                    }
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        show(index) {
            this.$Modal.info({
                title: '用户信息',
                content: `姓名：${this.data1[index].name}<br>年龄：${this.data1[index].age}<br>地址：${this.data1[index].address}`
            })
        }
    }
}