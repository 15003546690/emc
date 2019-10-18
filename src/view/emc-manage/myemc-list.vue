<template>
    <div>
      <div class="average">
        <p v-show='averageScore<6.5' class='zc-red'><span>平均分：</span>{{averageScore}}分</p>
        <p v-show='averageScore>6.6' class='zc-red'><span>平均分：</span>{{averageScore}}分</p>
        <p v-show='averageScore>=6.5 & averageScore<=6.6'><span>平均分：</span>{{averageScore}}分</p>
      </div>
      <div class="my-head">
       <el-button-group>
         <el-button :type="btnGroup==''?'primary':''" @click="all('全部')">全部</el-button>
         <el-button :type="btnGroup==1?'primary':''" @click="all('未考评')">未考评</el-button>
         <el-button :type="btnGroup==2?'primary':''" @click="all('已考评')">已考评</el-button>
         <el-select v-model="evId" placeholder="请选择考评" filterable clearable style='margin-left: 20px;'>
            <el-option
              v-for="(s,index) in evaluationList"
              :key='index'
              :label="s.name"
              :value="s.id">
            </el-option>
          </el-select>
          <el-select v-model="stateId" placeholder="请选择考评状态" filterable clearable>
            <el-option
              v-for="(s,index) in stateList"
              :key='index'
              :label="s.name"
              :value="s.id">
            </el-option>
          </el-select>
       </el-button-group>
       <el-button @click='searchL' type='primary'>搜索</el-button>

       <!-- <el-select v-model="evaluation.val" placeholder="请选择考评" @change='selec(evaluation.val)' filterable clearable>
          <el-option
            v-for="(item,index) in evaluation.list"
            :key='index'
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select> -->
      </div>
      <div class="table-Box">
        <!-- <div class="tableB-tab">
            <div v-for='(i,idx) in evaluation.list' @click='selec(i.id,idx)' :class="{'active':active==idx}">{{i.name}}</div>
        </div> -->
        <el-tabs type="border-card" @tab-click="selec()" v-model="activeName">
          <el-tab-pane :label="i.name" v-for='(i,idx) in evaluation.list' :key='idx'>
            <div class="table-content">
              <div class="my-table-left">
                <p>考核关系</p>
                <ul>
                  <li v-for='(i,idx) in surface' @click='rsClick(i.id,idx)' :class="{rsActivity:idx==rsIndex}">{{i.value}}</li>
                </ul>
              </div>
              <div class='my-table'>
                  <el-table
                      :data="tableData"
                      border>
                      <el-table-column
                        prop="name"
                        width=300
                        label="考评名称">
                      </el-table-column>
                      <el-table-column
                        prop="cover"
                        label="被考评项">
                      </el-table-column>
                      <el-table-column
                        prop="userWeight"
                        label="占比">
                        <template slot-scope="scope">
                          {{scope.row.userWeight*100}}%
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="status"
                        label="打分状态">
                        <template slot-scope="scope">
                          <span style="color: red" v-show='scope.row.status==0'>未考评</span>
                          <span style="color: green" v-show='scope.row.status!=0'>已考评</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="totalScore"
                        label="分数">
                        <template slot-scope="scope">
                          <el-input v-if='scope.row.show' v-model='scope.row.totalScore'></el-input>
                          <span v-else>{{scope.row.totalScore}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" min-width="80">
                        <template slot-scope="scope">
                          <!-- <div title='被考评项详情'  class='iconfont icon-details zc-btn' @click="handleDetal(scope.row)" ></div> -->
                          <!--<div title='评分'  class='iconfont icon-pingfen zc-btn' @click="handleScore(scope.$index,scope.row)" ></div>-->
                          <el-button size="small" type="primary" @click="handleScore(scope.$index,scope.row)">评分</el-button>
                          <!--<div title='打分详情'  class='iconfont icon-wj-khb zc-btn' @click="handleScoreDetail(scope.row)" ></div>-->
                          <!--<el-button size="small" type="primary" @click="handleScoreDetail(scope.row)">详情</el-button>-->
                          <!-- <div title='编辑'  class='iconfont icon-bianji zc-btn' @click="handleEdit(scope.$index,scope.row)" ></div> -->
                        </template>
                      </el-table-column>
                  </el-table>
            </div>

            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size='10'
        :current-page='page.current'
        @current-change='currentC'
        :total='this.page.total'>
      </el-pagination>
      <Layer :text='alert' v-show='alert.show'></Layer>
      <EvAlert v-show='evText.show' :text='evText'></EvAlert>
    </div>
</template>

<script>
import Layer from '../common/layer.vue';
import EvAlert from '../common/evaluation.vue'
  export default {
    watch:{
      $route(){
        let btnGroup=this.$route.query.btnGroup;
        if(btnGroup){
          this.btnGroup=btnGroup;
          setTimeout(()=>{
            this.currentTable(this.evaluation.val,0,1,this.evId);
          },1000)
        }

      }
    },
    components:{
      Layer,
      EvAlert
    },
    created(){
      let _myEmc=JSON.parse(sessionStorage.getItem('myEmcList'));
      this.currentData();
      if(_myEmc){
        this.btnGroup=_myEmc.btnGroup;
        this.evId=_myEmc.evId;
        this.stateId=_myEmc.stateId;
        this.activeName=_myEmc.activeName;
        this.rsIdx=_myEmc.rsIdx;
        this.rsIndex=_myEmc.rsIndex;
        this.exam=_myEmc.exam;
        this.evaluation.val=_myEmc.evaluation;
        this.efId=_myEmc.efId;
        this.currentTable(this.evaluation.val,this.exam,1,this.efId,this.evId,this.stateId)
      }else{
        let btnGroup=this.$route.query.btnGroup;
        if(btnGroup){
          this.btnGroup=btnGroup;
          setTimeout(()=>{
            this.currentTable(this.evaluation.val,0,1,'',this.evId);
            this.average(this.evaluation.val,this.exam,this.efId,this.evId,this.stateId);
          },1000)
        }else{
          setTimeout(()=>{
            this.currentTable(this.evaluation.val,'',1,'',this.evId);
            this.average(this.evaluation.val,this.exam,this.efId,this.evId,this.stateId);
          },1000)
        }
      }
    },
    data() {
      return {
        averageScore:'',//平均分
        stateId:'',
        stateList:[{
          id:0,
          name:'未开始'
        },{
          id:1,
          name:'已开始'
        },{
          id:2,
          name:'已结束'
        },],
        evaluationList:[],
        rsIndex:8888,
        rsIdx:0,
        surface:[],
        efId:'',
        evId:'',
        activeName:'',
        etId:'',
        evText:{
          show:false,
          eiName:'',
          orgName:'',
          suContent:'',
          other:'',
          list:[]
        },
        alert:{
          text:'保存成功',//提示的文字
          show:false,//显示隐藏
          type:'success'//显示类型
        },
        score:{//点击评分所需要的东西
          list:[],
          name:'',
          groupName:'',
          evId:'',
          evPeopleId:'',
          eiId:'',
          efId:'',
          etId:'',
          middleId:'',
          rsId:''
        },
        page:{
          current:1,
          total:null
        },
        exam:'',
        btnGroup:'',
        tableData: [],
        evaluation:{
          list:[],
          val:''
        },
        fileUpload:{   //附件上传
          file:null
        }
      }
    },
    methods:{
      //打分详情
      handleScoreDetail(_d){
        this.$router.push({
          name: 'EmcInfo',
          query: {
            evId: _d.evId,
            eiId: _d.eiId,
            rsId: _d.rsId
          }
        })
      },
      //编辑
      handleEdit(index, row) {
        if(!this.tableData[index].show){
          this.tableData[index].show=true;
        }else{
          this.tableData[index].show=false;
            /*this.tableData[index].key='编辑';
            this.$CPOST('/evaluateType/updateEvaluateType',{
              'etId':this.tableData[index].etId,
              'etName':this.tableData[index].name,
              'remark':this.tableData[index].remarks
            },(res)=>{
              if(res.code!=200){
                this.alert.text=res.msg;
                    this.alert.show=true;
                    this.alert.type='error';
              }
            })*/
        }
      },
      //平均分
      average(id,exam,efId,evId,status){
        this.$CPOST('/score/findMyAvgScore',{
          etId:id,
          gradeStatus:exam,
          rsId:efId,
          evId:evId,
          status:status
        },(res)=>{
          this.averageScore=res.data;
        })
      },
      searchL(){
        this.page.current=1;
        this.currentTable(this.evaluation.val,this.exam,1,this.efId,this.evId,this.stateId);
        this.average(this.evaluation.val,this.exam,this.efId,this.evId,this.stateId);
      },
      rsClick(id,idx){
        this.rsIdx=idx;
        this.page.current=1;
        this.efId=id;
        this.rsIndex=idx;
        this.currentTable(this.evaluation.val,this.exam,1,id,this.evId,this.stateId);
        this.average(this.evaluation.val,this.exam,this.efId,this.evId,this.stateId);
      },
      //分页
      currentC(page){
        this.page.current=page;
        this.currentTable(this.evaluation.val,this.exam,page,this.efId,this.evId,this.stateId);
      },
      //全部、未考评、已考评
      all(val){
        if(val=='全部'){
          this.page.current=1;
          this.exam='';
          this.btnGroup='';
          this.currentTable(this.evaluation.val,this.exam,1,this.efId,this.evId,this.stateId);
          this.average(this.evaluation.val,this.exam,this.efId,this.evId,this.stateId);
        }else if(val=='未考评'){
          this.page.current=1;
          this.exam=0;
          this.btnGroup=1;
          this.currentTable(this.evaluation.val,this.exam,1,this.efId,this.evId,this.stateId);
          this.average(this.evaluation.val,this.exam,this.efId,this.evId,this.stateId);
        }else{
          this.page.current=1;
          this.exam=1;
          this.btnGroup=2;
          this.currentTable(this.evaluation.val,this.exam,1,this.efId,this.evId,this.stateId);
          this.average(this.evaluation.val,this.exam,this.efId,this.evId,this.stateId);
        }
      },
      //评分、评优
      handleAppraising(){},
      //详情
      handleDetal(val){
        this.evText.list=[];
        this.$CPOST('/evaluateItem/findDetail',{
          evId:val.evId,
          eiId:val.eiId,
        },(res)=>{
          if(res.code==200){
            let data=res.data;
            for(let i=0;i<data.scoreDetaillVoList.length;i++){
              this.evText.list.push({
                score:data.scoreDetaillVoList[i].score,
                name:data.scoreDetaillVoList[i].userName
              })
            }
            this.evText.eiName=data.eiName;
            this.evText.orgName=data.orgName;
            this.evText.suContent=data.suContent;
            this.evText.other=data.other;
            this.evText.show=true;
          }else{
            this.alert.text=res.msg;
            this.alert.show=true;
            this.alert.type='error';
          }
        })
      },
      changeTarget(val){
        var aaa = val.split('；');
        // console.log(aaa);
        return aaa;
      },
      //打分详情
      detail(idx,val){
        this.$CPOST('/score/findScoreTarget',{
          evId:val.evId,
          middleId:val.middleId,
          // userId:this.$Id,//记得改token,
          eiId:val.eiId,
          efId:val.efId
        },(res)=>{
          if(res.code==200){
            let data=res.data.targetVos;
            for(let i=0;i<data.length;i++){
              this.score.list.push({
                targetName:data[i].targetName,//指标名称
                targetWeight:data[i].targetWeight,//占比
                score:data[i].score,//分数
                var1:this.changeTarget(data[i].var1),//绩效标准
                var2:this.changeTarget(data[i].var2),//评分方法
                targetId:data[i].targetId
              })
            }
            this.score.name=val.cover;
            this.score.groupName=res.data.orgName;
            this.score.evId=val.evId;
            this.score.evPeopleId=val.evPeopleId;
            this.score.eiId=val.eiId;
            this.score.efId=val.efId;
            this.score.etId=val.etId;
            this.score.middleId=val.middleId;
            this.score.rsId=val.rsId;
            this.score.etId=this.evaluation.val;
            this.score.remark=res.data.remark==null?'':res.data.remark;
            sessionStorage.setItem("data",JSON.stringify(this.score));
            this.$router.push({'path':'/index/Fraction','query':{data:this.score}});
          }else{
            this.alert.text=res.msg;
            this.alert.show=true;
            this.alert.type='error';
          }
        })
      },
      //评分
      handleScore(idx,val){
        let _d={
          btnGroup:this.btnGroup,
          exam:this.exam,
          evId:this.evId,
          stateId:this.stateId,
          activeName:this.activeName,
          rsIdx:this.rsIdx,
          rsIndex:this.rsIndex,
          evaluation:this.evaluation.val,
          efId:this.efId
        }
        sessionStorage.setItem("myEmcList",JSON.stringify(_d)); 
        console.log(sessionStorage.getItem('myEmcList'))
        this.$CPOST('/evaluate/isExamineTime',{
          evId:val.evId
        },(res)=>{
          if(res.code!=200){
            this.alert.text=res.msg;
            this.alert.show=true;
            this.alert.type='error';
          }else{
            this.detail(idx,val);
          }
        })
      },
      currentData(){
        this.$CPOST('/evaluateType/findAllEvaluateType',{

        },(res)=>{
          let data=res.data.list;
          for(let i=0;i<data.length;i++){

            this.evaluation.list.push({
              id:data[i].etId,
              name:data[i].etName
            })
          }
          this.etId=data[0].etId;
          this.evaluation.val=data[0].etId;
        })
        //考核表
        /*this.$CPOST('/evaluateForm/findEvaluateFormVo',{

              },(res)=>{
                let data=res.data;
                for(let i=0;i<data.length;i++){
                  this.surface.push({
                    value:data[i].efName,
                    id:data[i].efId
                  })
                }
              })*/
        this.$CPOST('/relation/findAboutMeRelationship',{

        },(res)=>{
          let data=res.data;
          for(let i=0;i<data.length;i++){
            this.surface.push({
              value:data[i].rsName,
              id:data[i].rsId
            })
          }
        })
        //请选择考评
        this.$CPOST('/evaluate/findAboutMeEvaluate',{
        },(res)=>{
          let data=res.data;
          for(let i=0;i<data.length;i++){
            this.evaluationList.push({
              id:data[i].evId,
              name:data[i].evName
            });
          }
          let _myEmc=JSON.parse(sessionStorage.getItem('myEmcList'));
          if(_myEmc){
            this.evId=_myEmc.evId;
          }else{
            this.evId = this.evaluationList[0].id;
          }
        });
      },
      selec(){
        this.page.current=1;
        this.rsIndex=8888;
        switch(this.activeName){
          case '0':
          this.evaluation.val=this.$store.state.id.user;
          break;
          case '1':
          this.evaluation.val=this.$store.state.id.pd;
          break;
          case '2':
          this.evaluation.val=this.$store.state.id.am;
          break;
          case '3':
          this.evaluation.val=this.$store.state.id.project;
          break;
        }
        this.currentTable(this.evaluation.val,this.exam,1,'',this.evId,this.stateId);
        this.average(this.evaluation.val,this.exam,this.efId,this.evId,this.stateId);
      },
      currentTable(id,exam,currentPage,efId,evId,status){
        const loading = this.$loading(this.$store.state.loading);
        this.tableData=[];
        this.$CPOST('/score/MyScoreList',{
          pageNum:currentPage,
          pageSize:10,
          etId:id,
          gradeStatus:exam,
          rsId:efId,
          evId:evId,
          status:status
        },(res)=>{
          loading.close();
          let data=res.data.list;
          let groupName;
          for(let i=0;i<data.length;i++){
            if(data[i].organizationPositions==null){
              groupName=''
            }else{
              groupName=data[i].organizationPositions[0].orgname;
            }
            this.tableData.push({
              name:data[i].evName,
              cover:data[i].eiName,
              status:data[i].gradeStatus,
              evId:data[i].evId,
              eiId:data[i].eiId,
              efId:data[i].efId,
              groupName:groupName,
              etId:data[i].etId,
              evPeopleId:data[i].evPeopleId,
              middleId:data[i].middleId,
              rsId:data[i].rsId,
              totalScore:data[i].totalScore,
              rsName:data[i].rsName,
              userWeight:data[i].userWeight,
              show:false
            })
          }
          this.page.total=res.data.total;
        })
      }
    }
  }
</script>
<style>
  .my-head .el-button{
    margin-left: 10px;
  }
</style>
<style scoped='scoped'>
  .tableB-tab{
    width: 100%;
    display: flex;
    margin-top: 30px;
    border-right: 50px;
    border-radius: 10px 10px 0 0;
  }
  .tableB-tab div{
    flex: 1;
    border: solid 1px #EBEEF5;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: #606266;
  }
  .table-Box{
    margin-bottom: 30px;
  }
  .my-head{
    margin-bottom: 30px;
    display: flex;
  }
  .table-content{
    display: flex;
  }
  .my-table{
    flex: 1;
  }
  .my-table-left{
    width: 170px;
    min-width: 170px;
    border: 1px solid #EBEEF5;
    border-right: none;
    background: #f8f8f8;
    height: 529px;
    overflow-y:scroll;
  }
  .my-table-left p{
    height: 48px;
    padding: 12px;
    border-bottom: 1px solid #EBEEF5;
    color: #909399;
    font-size: 14px;
    font-weight: bold;
  }
  .my-table-left ul li{
    padding: 12px;
    border-bottom: 1px solid #EBEEF5;
    color: #606266;
    font-size: 14px;
  }
  .rsActivity{
    background: #409EFF;
    color: #fff !important;
  }
  .average{
    margin-bottom: 20px;
    color: green;
    font-weight: bold;
  }
  .average span{
    color: #333;
  }
  .zc-red{
    color: red;
  }
</style>
