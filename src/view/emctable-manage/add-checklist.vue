<template>
    <div class='add-check'>
        <h2 class="addC-head">考核表编辑</h2>
        <div class="addC-content">
            <div class='addCC-top'>
                <p><span>考核表名称：</span><el-input v-model='name'></el-input></p>
                <p class="code"><span>备注：</span><el-input v-model='remark'></el-input></p>
                <div class="addCCT-add" v-for='(i,idx) in addList'>
                    <div class="el-icon-circle-close dele" v-if='i.delete' @click='del(idx)'></div>
                    <p><span class="idxname">KPI名称：</span>
                        <el-select v-model="i.targetId" placeholder="请选择KPI名称" filterable clearable style='width: 76%'>
                            <el-option
                              v-for="(j,idx) in i.nameList"
                              :key="idx"
                              :label="j.targetWeight"
                              :value="j.targetId">
                            </el-option>
                        </el-select>
                    </p>
                    <p><span>KPI权重：</span><el-input v-model=i.targetWeight @input='changeNum(i,idx)' maxlength=3></el-input>%</p>
                </div>
                <el-button type="primary" @click='add()'>新增KPI</el-button>
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
import Layer from '../common/layer.vue'
    export default{
        components:{
            Layer
        },
        created(){
            this.current();
            let query=this.$route.query.id;
            if(query!=undefined){
                let is=this.$route.query.id.efId
                this.name=query.efName;
                this.remark=query.remark;
                let list=query.targetVoList;
                for(let i=0;i<list.length;i++){
                    this.addList.push({
                        targetId:list[i].targetId,
                        targetWeight:list[i].targetWeight*100,
                        delete:i==0?false:true,
                        nameList:this.nameList
                    })
                }
                this.addList.splice(0,1);
            }
        },
        data(){
            return{
                remark:'',//备注
                titleName:'考核表新增',
                alert:{
                    text:'保存成功',//提示的文字
                    show:false,//显示隐藏
                    type:'success'//显示类型
                },
                addList:[
                    {
                        targetId:'',
                        targetWeight:'',
                        delete:false,
                        nameList:[]
                    }
                ],
                nameList:[],
                name:null,
                remarks:null,
                standard:null,
                score:null,
                code:null
            }
        },
        methods:{
            //必要数据加载
            current(){
                this.$CPOST('/target/findByTargetPage',{
                    pageNum:1,
                    pageSize:10000
                },(res)=>{
                    let query=this.$route.query.id;
                    let data=res.data.list;
                    if(query==undefined){
                        for(let i=0;i<data.length;i++){
                            this.nameList.push({
                                targetId:data[i].targetId,
                                targetWeight:data[i].targetName
                            })
                        }
                        this.addList[0].nameList=this.nameList;
                    }else{
                        this.titleName='考核表修改';
                        let is=this.$route.query.id.efId;
                        for(let i=0;i<data.length;i++){
                            this.nameList.push({
                                targetId:data[i].targetId,
                                targetWeight:data[i].targetName
                            })
                            if(is==undefined){
                                this.titleName='考核表新增';
                                this.addList[0].nameList.push({
                                    targetId:data[i].targetId,
                                    targetWeight:data[i].targetName
                                })
                            }
                        }
                    }  
                })
            },
            del(idx){
                this.addList.splice(idx,1)
            },
            add(){
                this.addList.push({
                    targetId:'',
                    targetWeight:'',
                    delete:true,
                    nameList:this.nameList
                })
            },
            save(){
                let query=this.$route.query.id;
                if(query!=undefined){
                    if(query.targetVoList!=undefined){
                        let arr=[];
                        for(let i=0;i<this.addList.length;i++){
                            arr.push({
                                targetId:this.addList[i].targetId,
                                targetWeight:this.addList[i].targetWeight/100
                            })
                        }
                        this.$CPOST('/evaluateForm/updateEvaluateFormByEfId',{
                            efId:query.efId,
                            efName:this.name,
                            targetList:JSON.stringify(arr),
                            remark:this.remark
                        },(res)=>{
                            if(res.code==200){
                                this.alert.text='保存成功';
                                this.alert.show=true;
                                this.alert.type='success';
                            }else{
                                this.alert.text=res.msg;
                                this.alert.show=true;
                                this.alert.type='error';
                            }
                        })
                    }else{
                        this.saveComon()
                    }
                }else{
                    this.saveComon()
                }
                    
            },
            //保存公共
            saveComon(){
                    if(this.name==''||this.name==null){
                        this.alert.text='考评类型名称不能为空';
                        this.alert.show=true;
                        this.alert.type='error';
                    }else{
                        let arr=[],repeat=[],data=[],count;
                        for(let i=0;i<this.addList.length;i++){
                            arr.push({
                                targetId:this.addList[i].targetId,
                                targetWeight:this.addList[i].targetWeight/100
                            })
                            repeat.push(this.addList[i].targetId);
                        }
                        this.$CPOST('/evaluateForm/addEvaluateForm',{
                            efName:this.name,
                            targetList:JSON.stringify(arr),
                            remark:this.remark
                        },(res)=>{
                            if(res.code==200){
                                this.addList=[{
                                    targetId:'',
                                    targetWeight:'',
                                    delete:false,
                                    nameList:[]
                                }];
                                this.name=null;
                                this.remarks=null;
                                this.remark=null;
                                this.code=null;
                                this.alert.text='保存成功';
                                this.alert.show=true;
                                this.alert.type='success';
                                this.current();
                            }else{
                                this.alert.text=res.msg;
                                this.alert.show=true;
                                this.alert.type='error';
                            }
                        })
                    }
            },
            //指标权重转换处理
            changeNum(e,idx){
                let cont=e.targetWeight.toString().replace(/[^0-9.]/g,'');
                if(cont>=100){
                    cont.substr(0,1);
                    cont=100;
                }else if(cont<1){
                    cont=1;
                }
                this.addList[idx].targetWeight=cont;
            },
            //取消
            cancel(){
                this.$router.push({path:'/index/checkList'})
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
        align-items: center;
    }
    .addCC-top p span{
        display: flex;
        width: 170px;
        justify-content: center;
        align-items: center;
    }
    .addCC-top button{
        margin-left: 20px;
    }
    .addC-btn-group{
        width: 500px;
        display: flex;
        margin-top: 150px;
    }
    .addC-btn-group button{
        flex: 1
    }
    .code{
        margin-bottom: 65px !important;
    }
    .addCCT-add{
        position: relative;
        border: solid 1px #f5f5f5;
        padding: 15px 10px;
        margin-bottom: 20px;
    }
    .addCCT-add div:first-child{
        color: red;
        position:absolute;
        right: -10px;
        top: -10px;
        z-index: 9;
    }
    .idxname{
        display: inline-block;
        margin-left: -22px;
        margin-right: -20px;
    }
    .dele{
        cursor: pointer;
    }
</style>