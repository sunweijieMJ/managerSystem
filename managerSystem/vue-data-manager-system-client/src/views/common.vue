<template>
    <div>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="/">首页</Breadcrumb-item>
                <Breadcrumb-item>评论中心</Breadcrumb-item>
            </Breadcrumb>
        </div>

        <Input class="text" v-model="textarea" :autosize="{minRows: 8,maxRows: 20}" type="textarea" placeholder="请输入..."></Input>
        <Row>
            <i-col span="12">
                <Rate show-text v-model="valueText"></Rate>
            </i-col>
        </Row>
        <Button class="btn" type="success" @click="submit">提交</Button>
        <Button class="btn" type="warning" @click="reset">重置</Button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                textarea: '',
                content: {},
                valueText: 0,
            }
        },
        methods: {
            submit(){
                this.content = {
                    newsId: this.$route.query.row._id,
                    title: this.$route.query.row.title,
                    valueText: this.valueText,
                    textarea: this.textarea
                }
                console.log(this.$route.query.row.commentCount);
                this.$http.post('http://localhost:3000/common/data',this.content).then((res) => {
                    this.textarea = '';
                });
            },
            reset(){
                this.textarea = '';
            }
        }
    }
</script>
<style scoped>
    .text{
        height:200px;
    }
    .btn{
        margin: 10px;
    }
</style>