<template>
    <div class='add-check'>
        <h2 class="addC-head">考评关系编辑</h2>
        <div class="addC-content">
            <div class='addCC-top'>
                <p class="add-p"><span>考评关系名称：</span><el-input v-model='info.name' :disabled="disabled"></el-input></p>
                <p class="add-p"><span class="idxname">考核类型：</span>
                    <el-select v-model="info.type" placeholder="请选择" filterable clearable :disabled="disabled">
                        <el-option
                          v-for="(item,index) in info.etList"
                          :key='index'
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                    </el-select>
                </p>
                <p class="code add-p">
                    <span class="idxname">被考核项：</span>
                    <el-tree-select v-model="info.selected"
                                v-if="info.type == $store.state.id.am"
                                :disabled="disabled"
                                :selectParams="selectParams"
                                :treeParams="treeParams"
                                @searchFun="handleOrgSearchClick"
                                ref="treeSelect">
                    </el-tree-select>
                    <el-select v-model="info.progectName" v-if='info.type==$store.state.id.project' placeholder="请选择" multiple filterable clearable :disabled="disabled">
                        <el-option
                          v-for="(item,index) in info.progectList"
                          :key='index'
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="info.pdName" v-if='info.type==$store.state.id.pd' placeholder="请选择" multiple filterable clearable :disabled="disabled">
                        <el-option
                          v-for="(item,index) in info.pdList"
                          :key='index'
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="info.jobId" placeholder="请选择职位" filterable clearable v-if='info.type==$store.state.id.user' @visible-change='jobChange($event)' @remove-tag='remove' multiple :disabled="disabled">
                        <el-option
                          v-for="(i,idx) in job"
                          :key="idx"
                          :label="i.name"
                          :value="i.id">
                        </el-option>
                    </el-select>
                </p>
                <p class="zc-p">
                    <span></span>
                    <el-transfer v-model="info.userName" :data="jobData" filterable :titles="['未选择', '已选择']" v-if="info.type=='03af4af55ce14eee82c02b66ba30c226'" :disabled="disabled"></el-transfer>
                </p>
                <div class="tableList" v-for='(i,index) in surfaceList'>
                    <!-- 考核表 -->
                    <div class="addCCT-add">
                        <div class="el-icon-circle-close dele" v-if='i.delete' @click='del("考核表",index)'></div>
                        <p><span class="idxname">考核表：</span>
                            <el-select v-model="i.targetId" placeholder="请选择考核表名称" filterable clearable>
                                <el-option
                                  v-for="(j,idx) in i.surface"
                                  :key="idx"
                                  :label="j.name"
                                  :value="j.id">
                                </el-option>
                            </el-select>
                        </p>
                        <p><span>考核表权重：</span><el-input v-model=i.targetWeight @input='changeNum("考核表",i,index)' maxlength=3></el-input>%</p>
                    </div>
                    <!-- 考评人 -->
                    <div class="addCCT-add" v-for='(j,idxx) in i.personList'>
                        <div class="el-icon-circle-close dele" v-if='j.delete' @click='del("考评人",index,idxx)'></div>
                        <p><span>考评人类型：</span>
                            <el-select v-model="j.typeId" placeholder="请选择考核类型" filterable clearable>
                                <el-option
                                  v-for="(z,idx) in j.type"
                                  :key="idx"
                                  :label="z.name"
                                  :value="z.id">
                                </el-option>
                            </el-select>
                        </p>
                        <p v-if='j.typeId==1'><span class="idxname">考评人：</span>
                            <el-select v-model="j.targetId" placeholder="请选择考评人名称" filterable clearable multiple>
                                <el-option
                                  v-for="(z,idx) in j.person"
                                  :key="idx"
                                  :label="z.name"
                                  :value="z.id">
                                </el-option>
                            </el-select>
                        </p>
                        <p v-if='j.typeId==2'><span class="idxname">职位：</span>
                            <el-select v-model="j.targetId" placeholder="请选择职位名称" filterable clearable multiple>
                                <el-option
                                  v-for="(z,idx) in j.job"
                                  :key="idx"
                                  :label="z.name"
                                  :value="z.id">
                                </el-option>
                            </el-select>
                        </p>
                        <p v-if='j.typeId==1'><span>考评人权重：</span><el-input v-model=j.targetWeight @input='changeNum("考评人",index,j,idxx)' maxlength=3 filterable clearable></el-input>%</p>
                        <p v-if='j.typeId==2'><span>职位权重：</span><el-input v-model=j.targetWeight @input='changeNum("考评人",index,j,idxx)' maxlength=3 filterable clearable></el-input>%</p>
                    </div>
                    <el-button type="primary" @click='adds("考评人",index)' >+</el-button>
                </div>
                <el-button type="primary" @click='adds("考核表")'style='font-size: 20px;font-weight: bold;'>+</el-button>
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
import elTreeSelect from 'el-tree-select';
import Layer from '../common/layer.vue'
    export default {
        created(){
            const loading = this.$loading(this.$store.state.loading);
            let query=this.$route.query.rsId;
            if(query!=undefined){
                this.disabled=true;
                this.$axios.all([this.currentData(),this.jobCurent(),this.upData()])
                .then(this.$axios.spread((ecct,perms)=>{
                    loading.close();
                }))

            }else{
                this.$axios.all([this.currentData(),this.jobCurent()])
                .then(this.$axios.spread((ecct,perms)=>{
                    loading.close();
                }))
            }
        },
        components:{
            Layer,
            elTreeSelect
        },
        data() {
            return {
                jobData:[],
                disabled:false,
                repeat:{
                    group:[],
                },
                totalArr:[],
                alert:{
                    text:'保存成功',//提示的文字
                    show:false,//显示隐藏
                    type:'success'//显示类型
                },
                info:{
                        name:'',
                        type:'',
                        isType:'',
                        etList:[],//考核类型列表
                        options:[],//部门的联级
                        selected:[],//部门联级选中项
                        progectList:[],//项目集合
                        progectName:[],
                        pdList:[],
                        pdName:[],
                        userList:[],
                        userName:[],
                        jobId:'',//职位Id
                        jobChild:[]
                },
                surface:[],//考核表渲染
                person:[],//考评人渲染
                job:[],
                surfaceList:[
                    {
                        targetId:'',
                        targetWeight:'',
                        delete:false,
                        surface:[],
                        personList:[
                            {
                                targetId:[],
                                targetWeight:'',
                                delete:false,
                                person:[],
                                job:[],
                                typeId:1,
                                type:[{
                                    name:'人员',
                                    id:1
                                },{
                                    name:'职位',
                                    id:2
                                }]
                            }
                        ],
                    }
                ],
                props: {
                    value: 'orgId',
                    label: 'orgName',
                    children: 'children'
                }, // 组织架构
                selectParams: {
                    multiple: true,
                    clearable: true,
                    placeholder: '请输入内容'
                },
                jobChildParams:{
                    multiple: true,
                    clearable: true,
                    placeholder: '请输入内容'
                },
                jobtreeParams:{
                    clickParent: false,
                    filterable: true,
                    'check-strictly': false,//就是那个多选
                    'default-expand-all': true,
                    'expand-on-click-node': false,
                    'render-content': this._renderFun,
                    data: [],
                    props: {
                    children: 'children',
                    label: 'orgName',
                    disabled: 'disabled',
                    value: 'orgId'
                    }
                },
                treeParams: {
                    clickParent: false,
                    filterable: true,
                    'check-strictly': true,//就是那个多选
                    'default-expand-all': true,
                    'expand-on-click-node': false,
                    'render-content': this._renderFun,
                    // 'default-checked-keys': [],
                    data: [],
                    props: {
                    children: 'children',
                    label: 'orgName',
                    disabled: 'disabled',
                    value: 'orgId'
                    }
                }
            }
        },
        methods:{
            //工作渲染
            jobCurent(){
                this.jobData=[];
                    this.$UPOST('/api/umc/user/findByPositionId',{
                        positionIdList:this.info.jobId
                    },(res)=>{
                        let data=res.data;
                        for(let i=0;i<data.length;i++){
                            this.jobData.push({
                                key:data[i].userId,
                                label:data[i].userName
                            })
                        }
                    })
            },
            //删除职位
            remove(){
                /*this.jobtreeParams.data = [];
                this.info.userName=[];*/
                this.jobCurent();
            },
            //职位修改
            jobChange(e){
                if(e==false){
                    this.jobCurent();
                }
                /*this.$UPOST('/api/umc/orignization/findOrgUserTreeByPositionId',{
                    positionIds:JSON.stringify(val)
                },(res)=>{
                    let data = res.data;
                    // this.info.options = data;
                    this.jobtreeParams.data = data;
                    this.$refs.jobtreeSelect.treeDataUpdateFun(data);

                })*/
            },
            aAalert(val){
              this.alert.text=val;
              this.alert.show=true;
              this.alert.type='error';
            },
            //回显
            upData(){
                let rsId=this.$route.query.rsId,
                    eiId=this.$route.query.eiId;
                this.$CPOST('/relation/findEiByRsIdAndEiId',{
                    rsId:rsId,
                    eiId:eiId
                },(res)=>{
                    this.surfaceList=[];
                    let data=res.data,list=data.efOfRelationDtoList;
                    this.info.name=data.rsName;
                    this.info.type=data.etId;
                    // this.info.jobId=eiId;
                    switch(data.etId){
                        case this.$store.state.id.user:
                        this.info.jobId=data.eiIdList==null?[]:data.positionIdList
                        this.jobData.push({
                            label:data.eiName,
                            key:data.eiIdList[0],
                            disabled:true
                        })
                        this.info.userName.push(
                            data.eiIdList[0]
                        )
                        break;
                        case this.$store.state.id.pd:
                        this.info.pdName=data.eiIdList==null?[]:data.eiIdList
                        break;
                        case this.$store.state.id.am:
                        this.info.selected=data.eiIdList==null?[]:data.eiIdList
                        break;
                        case this.$store.state.id.project:
                        this.info.progectName=data.eiIdList==null?[]:data.eiIdList
                        break;
                    }
                    for(let i=0;i<list.length;i++){
                        this.surfaceList.push({
                            targetId:list[i].efId,
                            targetWeight:list[i].efWeight*100,
                            delete:i==0?false:true,
                            surface:this.surface,
                            personList:[]
                        })
                        let children=list[i].epAndUserWeightDtoList;
                        for(let j=0;j<children.length;j++){
                            this.surfaceList[i].personList.push({
                                targetId:children[j].evPeopleIdList,
                                targetWeight:children[j].userWeight*100,
                                delete:j==0?false:true,
                                person:this.person,
                                job:this.job,
                                typeId:parseInt(children[j].evaluationPeopleType),
                                type:[{
                                    name:'人员',
                                    id:1
                                },{
                                    name:'职位',
                                    id:2
                                }]
                            })
                        }
                    }
                })
            },
            //指标权重转换处理
            changeNum(val,firstId,firstIndex,childrenIndex){
                if(val=='考核表'){
                    let cont=firstId.targetWeight.toString().replace(/[^0-9.]/g,'');
                    if(cont>=100){
                        cont.substr(0,1);
                        cont=100;
                    }else if(cont<1){
                        cont=1;
                    }
                    this.surfaceList[firstIndex].targetWeight=cont;
                }else{
                    let cont=this.surfaceList[firstId].personList[childrenIndex].targetWeight.toString().replace(/[^0-9.]/g,'');
                    if(cont>=100){
                        cont.substr(0,1);
                        cont=100;
                    }else if(cont<1){
                        cont=1;
                    }
                    this.surfaceList[firstId].personList[childrenIndex].targetWeight=cont;
                }

            },
            //添加
            adds(val,i){
                if(val=='考评人'){
                    this.surfaceList[i].personList.push({
                        targetId:'',
                        targetWeight:'',
                        delete:true,
                        person:this.person,
                        job:this.job,
                        typeId:1,
                        type:[{
                            name:'人员',
                            id:1
                        },{
                            name:'职位',
                            id:2
                        }]
                    })
                }else{
                    this.surfaceList.push({
                        targetId:'',
                        targetWeight:'',
                        delete:true,
                        surface:this.surface,
                        personList:[
                            {
                                targetId:'',
                                targetWeight:'',
                                delete:false,
                                person:this.person,
                                job:this.job,
                                typeId:1,
                                type:[{
                                    name:'人员',
                                    id:1
                                },{
                                    name:'职位',
                                    id:2
                                }]
                            }
                        ]
                    })
                }
            },
            //删除
            del(val,index,idx){
                if(val=='考评人'){
                    this.surfaceList[index].personList.splice(idx,1);
                }else{
                    this.surfaceList.splice(index,1)
                }

            },
            currentData(){
                //考核类型
                this.$CPOST('/evaluateType/findAllEvaluateType',{
                },(res)=>{
                    let data=res.data.list;
                    for(let i=0;i<data.length;i++){
                      this.info.etList.push({
                        id:data[i].etId,
                        name:data[i].etName
                      })
                    }
                })
                //部门绩效考评
                this.$UPOST('/api/umc/orignization/findOrgTree',{},(res)=>{
                    let data = res.data;
                    this.info.options = data;
                    this.treeParams.data = data;
                    this.$refs.treeSelect.treeDataUpdateFun(data);
                })
                // this.$UPOST('/api/umc/orignization/findMyUnderAllOrg',{},(res)=>{
                //     let data=res.data;
                //     for(let i=0;i<data.length;i++){
                //         this.info.options.push({
                //             id:data[i].orgId,
                //             name:data[i].orgName
                //         })
                //     }
                // })
                //项目考核
                this.$UPOST('/api/pjc/project/findAllProject',{},(res)=>{
                    let data=res.data.list;
                    for(let i=0;i<data.length;i++){
                        this.info.progectList.push({
                            id:data[i].projectId,
                            name:data[i].name
                        })
                    }
                })
                //产品
                this.$UPOST('/api/pdc/product/findAllProductVersion',{

                },(res)=>{
                    let data=res.data.list;
                    for(let i=0;i<data.length;i++){
                        this.info.pdList.push({
                            id:data[i].productId,
                            name:data[i].productName
                        })
                    }
                })
                //用户
                this.$UPOST('/api/umc/user/findMyOrgUser',{

                },(res)=>{
                    let data=res.data;
                    for(let i=0;i<data.length;i++){
                        this.info.userList.push({
                            id:data[i].userId,
                            name:data[i].userName
                        })
                    }
                })
                //考核表渲染
                this.$CPOST('/evaluateForm/findEvaluateFormVo',{

                },(res)=>{
                    let data=res.data;
                    for(let i=0;i<data.length;i++){
                      this.surface.push({
                        name:data[i].efName,
                        id:data[i].efId
                      })
                    }
                    this.surfaceList[0].surface=this.surface;
                })
                //考评人渲染
                this.$UPOST('/api/umc/user/findUserAll',{
                        pageNo:1,
                        pageSize:1000000
                        },(res)=>{
                            let data=res.data.list;
                            for(let i=0;i<data.length;i++){
                            this.person.push({
                            name:data[i].userName,
                            id:data[i].userId
                        })
                    }
                    this.surfaceList[0].personList[0].person=this.person;
                })
                //职业渲染
                this.$UPOST('/api/umc/position/findPositionAll',{

                },(res)=>{
                    let data=res.data;
                    for(let i=0;i<data.length;i++){
                        this.job.push({
                            name:data[i].positionName,
                            id:data[i].positionId
                        })
                    }
                    this.surfaceList[0].personList[0].job=this.job;
                })
            },
            //保存
            save(){
                let obj={},data=this.surfaceList,arr=[];
                let query=this.$route.query.rsId;
                obj.etId=this.info.type;
                switch(this.info.type){
                    case this.$store.state.id.user:
                    this.totalArr=this.info.userName
                    break;
                    case this.$store.state.id.pd:
                    this.totalArr=this.info.pdName
                    break;
                    case this.$store.state.id.am:
                    this.totalArr=this.info.selected
                    break;
                    case this.$store.state.id.project:
                    this.totalArr=this.info.progectName
                    break;
                }
                obj.eiIdList=this.totalArr;
                obj.efOfRelationDtoList=[];
                for(let i=0;i<data.length;i++){
                    let psList=data[i].personList
                    obj.efOfRelationDtoList.push({
                        efId:data[i].targetId,
                        efWeight:data[i].targetWeight/100,
                        epAndUserWeightDtoList:[]
                    })
                    for(let j=0;j<psList.length;j++){
                        obj.efOfRelationDtoList[i].epAndUserWeightDtoList.push({
                            evPeopleIdList:psList[j].targetId,
                            userWeight:psList[j].targetWeight/100,
                            evaluationPeopleType:psList[j].typeId
                        })
                    }
                }
                //去重
                /*let efArr=[];
                for(let i=0;i<obj.efOfRelationDtoList.length;i++){
                    efArr.push(obj.efOfRelationDtoList[i].efId)
                    let list=obj.efOfRelationDtoList[i].epAndUserWeightDtoList;
                    for(let j=0;j<list.length;j++){
                        console.log(list[j].evaluationPeopleId)
                    }
                }
                let lookP=this.$Duplicates(efArr);
                if(lookP.length!=0){
                    this.alert.text='考核表不可重复'
                    this.alert.show=true;
                    this.alert.type='error';
                }*/
                if(query!=undefined){
                    obj.rsId=this.$route.query.rsId;//编辑保存
                    this.$CPOST('/relation/updateEiRelationship',{
                        addRelationshipDto:JSON.stringify(obj)
                    },(res)=>{
                        if(res.code!=200){
                            this.aAalert(res.msg)
                        }else{
                            this.aAalert('修改成功');
                            this.$router.push({path:'/index/emcSetting'});
                        }
                    })
                }else{
                    obj.rsName=this.info.name;//普通保存
                    this.$CPOST('/relation/addRelationship',{
                        addRelationshipDto:JSON.stringify(obj)
                    },(res)=>{
                        if(res.code==200){
                            this.jobData=[];
                            this.info.name='';
                            this.info.type='';
                            this.totalArr=[];
                            this.surfaceList=[{
                                targetId:'',
                                targetWeight:'',
                                delete:false,
                                surface:this.surface,
                                personList:[
                                    {
                                        targetId:'',
                                        targetWeight:'',
                                        delete:false,
                                        person:this.person
                                    }
                                ],
                            }],
                            this.alert.text='保存成功'
                            this.alert.show=true;
                            this.alert.type='success';
                            this.currentData();
                        }else{
                            this.alert.text=res.msg
                            this.alert.show=true;
                            this.alert.type='error';
                        }
                    })
                }


            },
            cancel(){
                this.$router.push({path:'/index/emcSetting'});
            },
            handleOrgSearchClick (value) {
                this.$refs.treeSelect.$refs.tree.filter(value);
            },
            handleOrgSearchClicks (value) {
                this.$refs.jobtreeSelect.$refs.tree.filter(value);
            }
        }
    }
</script>

<style scoped='scoped'>
    .alt{
        margin-bottom: 30px;
    }
    .el-input{
        width: 217px;
        margin-right: 10px;
    }
    .addC-head{
        margin-bottom: 50px;
    }
    .addCC-top{
        width: 1000px;
    }
    .add-p{
        padding: 10px 10px 0 10px;
        margin-bottom: 10px !important;
    }
    .addCC-top p{
        display: flex;
        margin-bottom: 20px;
        align-items: center;

    }
    .addCC-top p span{
        display: inline-block;
        /*display: flex;*/
        width: 150px;
        text-align: right;
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
    }
    .addCCT-add div:first-child{
        color: red;
        position:absolute;
        right: -16px;
        top: -22px;
        z-index: 9;
    }
    .idxname{
        display: inline-block;
    }
    .dele{
        cursor: pointer;
    }
    .tableList{
        width: 500px;
        margin-bottom: 60px;
        border: solid 1px #f5f5f5;
        padding: 15px 10px;
    }
    .zc-p{
        margin: -50px 0 40px 10px !important;
    }
</style>
