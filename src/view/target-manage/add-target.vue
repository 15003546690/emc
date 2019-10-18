<template>
    <div class='add-check'>
        <h2 class="addC-head">指标新增</h2>
        <div class="addC-content">
            <div class='addCC-top'>
                <p><span>指标名称：</span><el-input v-model='name'></el-input></p>
                <!-- <p><span>指标编码：</span><el-input v-model='code'></el-input></p> -->
                <p><span>备注：</span><el-input v-model='remarks'></el-input></p>
                <p><span>绩效标准：</span><el-input v-model='standard'></el-input></p>
                <p><span>评分方法：</span><el-input v-model='score'></el-input></p>
            </div>
            <div class='addC-btn-group'>
                <el-button type="primary" @click='save()'>保存</el-button>
                <el-button  @click='cancel()'>取消</el-button>
            </div>
        </div>
        <Layer :text='alert' v-show='alert.show'></Layer>
    </div>
</template>
<script>
import Layer from '../common/layer.vue';
    export default{
        components:{
            Layer
        },
        data(){
            return{
                alert:{
                    text:'保存成功',//提示的文字
                    show:false,//显示隐藏
                    type:'success'//显示类型
                },
                name:null,
                remarks:null,
                code:null,
                standard:null,
                score:null
            }
        },
        methods:{
            aAalert(text,status){
                this.alert.text=text;
                this.alert.show=true;
                this.alert.type=status;
            },
            save(){
                if(this.name==''){
                    this.aAalert('请输入指标名称','error');
                }else{
                    this.$CPOST('/target/addTarget',{
                        targetName:this.name,
                        targetCode:this.code,
                        remark:this.remarks,
                        var1:this.standard,
                        var2:this.score
                    },(res)=>{
                        if(res.code==200){
                            this.name='';
                            this.remarks='';
                            this.code='';
                            this.standard='';
                            this.score='';
                            this.aAalert('保存成功','success')
                        }else if(res.code!=200){
                            this.aAalert(res.msg,'error')
                        }
                    })
                }
            },
            cancel(){
                this.$router.push({path:'/index/TargetList'})
            }
        }
    }
</script>
<style scoped='scoped'>
    .alt{
        margin-bottom: 30px;
    }
    .addC-head{
        margin-bottom: 50px;
    }
    .addCC-top{
        width: 500px;
    }
    .addCC-top p{
        display: flex;
        margin-bottom: 20px;
    }
    .addCC-top p span{
        display: flex;
        width: 170px;
        justify-content: center;
        align-items: center;
    }
    .addC-btn-group{
        width: 500px;
        display: flex;
        margin-top: 150px;
    }
    .addC-btn-group button{
        flex: 1
    }
</style>