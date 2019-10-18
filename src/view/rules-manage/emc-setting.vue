<template>
    <div>
        <!-- <el-steps :active="2" process-status="process">
            <el-step title="发起考评"></el-step>
            <el-step title="考评设置"></el-step>
            <el-step title="开始评分"></el-step>
               </el-steps> -->
       <div class="setting-sele">
          <div class='settingS-top'>
            <el-select v-model="evaluationVal" placeholder="请选择考评" @change='selec(evaluationVal)' filterable clearable>
              <el-option
                v-for="(s,index) in evaluationList"
                :key='index'
                :label="s.name"
                :value="s.id">
              </el-option>
            </el-select>
            <el-button type='primary' @click='start'>下一步</el-button>
          </div>
          <div class="settingS-center">
            <!-- <el-select v-model="model.evaluation" placeholder="请输入考评关系名称" filterable clearable>
              <el-option
                v-for="(i,index) in info.evaluationName"
                :key='index'
                :label="i.value"
                :value="i.id">
              </el-option>
            </el-select> -->
            <el-select v-model="search.coverName" placeholder="请输入被考评项" filterable clearable>
              <el-option
                v-for="(j,index) in info.coverName"
                :key='index'
                :label="j.value"
                :value="j.id">
              </el-option>
            </el-select>
            <el-select v-model="search.examiner" placeholder="请输入考评人" filterable clearable>
              <el-option
                v-for="(item,index) in info.examiner"
                :key='index'
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="search.surface" placeholder="请输入考核表" filterable clearable>
              <el-option
                v-for="(k,index) in info.surface"
                :key='index'
                :label="k.value"
                :value="k.id">
              </el-option>
            </el-select>
            <el-button type='primary' @click='searchS()'>搜索</el-button>
            <!-- :headers={Authorization:this.$store.state.token} -->
            <!-- <el-upload
              class="setting-upload"
              style='margin-right: 0'
              :action="uploadUrl"
              accept=".xls"
              :headers={token:this.$Token}
              :before-upload="fileBefore"
              :on-success='fileSuccess'
              :data='fileUpload'>
              <el-button type='primary'>导入</el-button>
            </el-upload> -->
            <el-upload
              class="setting-upload"
              style='margin-right: 0'
              :http-request='httpRequest'
              action=""
              accept=".xls"
              :before-upload="fileBefore"
              :on-success='fileSuccess'>
              <el-button type='primary'>导入</el-button>
            </el-upload>
            <el-button type='primary' @click='exportE()' style='margin-right: 0;'>导出</el-button>
            <el-button type='primary' @click='add()'>新增</el-button>
          </div>
       </div>
       <div class="setting-table">
          <div class="settingT-left">
            <div>
              <p>选择</p>
              <p style="overflow: hidden;"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style='margin-left: 15px;'>全选</el-checkbox></p>
              <ul>
                <li v-for='i in info.evaluationName' style="overflow: hidden;">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox :label="i.id" class='zc-check' style='margin-left: 15px;'></el-checkbox>
                </el-checkbox-group>
                </li>
              </ul>
            </div>
            <div class="second">
              <p>考评关系名称</p>
              <p :class="{rsActivity:rsIndex==8888}" @click='all'>全部</p>
              <ul v-for='(i,idx) in info.evaluationName'>
                <li @click='rsClick(i.id,idx)' :class="{rsActivity:idx==rsIndex}">{{i.value}}<span v-show='idx==rsIndex' @click='reDelete(i.id)'>x</span></li>
              </ul>
            </div>
          </div>
          <el-table
              :data="tableData"
              :span-method="objectSpanMethod"
              height="500"
              border
>
              <el-table-column
                prop="eiName"
                label="被考核项"
                width="180">
                <template slot-scope="scope">
                  <el-input v-if='scope.row.show' v-model='scope.row.eiName'></el-input>
                  <span v-else>{{scope.row.eiName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="eiCode"
                label="被考核项编号"
                width="120">
                <template slot-scope="scope">
                  <el-input v-if='scope.row.show' v-model='scope.row.eiCode'></el-input>
                  <span v-else>{{scope.row.eiCode}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="efName"
                label="考核表"
                min-width="180">
                <template slot-scope="scope">
                  <el-input v-if='scope.row.show' v-model='scope.row.efName'></el-input>
                  <span v-else>{{scope.row.efName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="efWeight"
                label="考核表权重"
                width="100">
                <template slot-scope="scope">
                  <el-input v-if='scope.row.show' v-model='scope.row.efWeight'></el-input>
                  <span v-else>{{scope.row.efWeight*100}}%</span>
                </template>
              </el-table-column>
              <el-table-column
               prop="epName"
               label="考评人"
               width="180">
               <template slot-scope="scope">
                 <el-input v-if='scope.row.show' v-model='scope.row.epName'></el-input>
                 <span v-else>{{scope.row.epName}}</span>
               </template>
             </el-table-column>
             <el-table-column
               prop="epCode"
               label="考评人工号"
               width="130">
               <template slot-scope="scope">
                 <el-input v-if='scope.row.show' v-model='scope.row.epCode'></el-input>
                 <span v-else>{{scope.row.epCode}}</span>
               </template>
             </el-table-column>
             <el-table-column
               prop="epWeight"
               label="考评人权重"
               width="100">
               <template slot-scope="scope">
                 <el-input v-if='scope.row.show' v-model='scope.row.epWeight'></el-input>
                 <span v-else>{{scope.row.epWeight*100}}%</span>
               </template>
             </el-table-column>
             <el-table-column
               label="编辑"
               width="100">
               <template slot-scope="scope">
                 <!-- <el-button
                  size="mini"
                  @click="operation(scope.row)">编辑</el-button> -->
                  <div class="iconfont icon-bianji zc-btn" @click="operation(scope.row)"></div>
                  <div class="iconfont icon-shanchu zc-btn" style="color: red" @click='deletes(scope.$index,scope.row.eiId)'></div>
               </template>
             </el-table-column>
          </el-table>
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
    </div>
</template>
<script>
import Layer from '../common/layer.vue';
    export default {
        components:{
          Layer
        },
        created(){
          // const loading = this.$loading(this.$store.state.loading);
          this.$axios.all([this.currentTable(1),this.currentData()])
          .then(this.$axios.spread((ecct,perms)=>{
            // loading.close();
          }))
        },
        data() {
            return {
                isIndeterminate:true,
                checkAll: false,
                rsIndex:8888,
                allCheck:[],
                rs:[],
                OrderIndexArr:[],//合并单元格筛选
                mergeLen:'',
                alert:{
                  text:'保存成功',//提示的文字
                  show:false,//显示隐藏
                  type:'success'//显示类型
                },
                page:{
                  current:1,
                  total:null
                },
                uploadUrl:this.$http+'/file/importRelastionship',
                checkList:[],
                search:{//接口所用到的对应ID
                  evaluation:'',
                  coverName:'',
                  examiner:'',
                  surface:''
                },
                model:{//所对应的Name
                  evaluation:'',
                  coverName:'',
                  examiner:'',
                  surface:''
                },
                evaluationVal:'',
                evaluationList:[],
                info:{//渲染页面所用
                  evaluationName:[],//考评关系
                  coverName:[],
                  examiner:[],
                  surface:[]
                },
                fileUpload:{   //附件上传
                  file:null
                },
                fileList:[],
                tableData: [],
                startInfo:{//开始考评数据
                  evId:'',
                  rsId:[]
                }
            }
        },
        methods:{
            //考评关系删除
            reDelete(id){
              this.$alert('确定要删除吗？', '', {
                confirmButtonText: '确定',
                callback: action => {
                  if(action=='confirm'){
                    this.$CPOST('/relation/delRelationship',{
                        rsId:id
                    },(res)=>{
                      if(res.code==200){
                        this.alert.text=res.msg;
                        this.alert.show=true;
                        this.alert.type='success';
                        this.info.evaluationName=[];
                        this.currentData();
                        this.currentTable(1);
                        this.rsIndex==8888;
                      }else{
                        this.alert.text=res.msg;
                        this.alert.show=true;
                        this.alert.type='error';
                      }
                    })
                  }
                }
              })

            },
            //删除
            deletes(index,eiId){
              this.$alert('确定要删除吗？', '', {
                confirmButtonText: '确定',
                callback: action => {
                  if(action=='confirm'){
                    this.$CPOST('/relation/delEi',{
                      rsId: this.search.evaluation,
                      eiId
                    },(res)=>{
                      if(res.code==200){
                        this.tableData.splice(index,1);
                        this.curData(1);
                        this.searchInput();
                        this.page.current=1;
                      }else{
                        this.alert.text=res.msg;
                        this.alert.show=true;
                        this.alert.type='error';
                      }
                    })}
                }
              })

            },
            //全选
            handleCheckAllChange(val) {
              this.checkList = val ? this.allCheck : [];
              this.isIndeterminate = false;
            },
            //编辑
            operation(val){
              this.$CPOST('/relation/findEiByRsIdAndEiId',{
                    rsId:this.search.evaluation,
                    eiId:val.eiId
                },(res)=>{
                  if(res.code==200){
                     this.$router.push({'path':'/index/addRelation',query:{rsId:this.search.evaluation,eiId:val.eiId}})
                   }else{
                      this.alert.text=res.msg
                      this.alert.show=true;
                      this.alert.type='error';
                   }
                })
            },
            all(){
              this.rsIndex=8888;
              this.model.evaluation='';
              this.model.coverName='';
              this.model.examiner='';
              this.model.surface='';
              this.search.evaluation = '';
              this.searchS('all');
            },
            //单选
            rsClick(id,idx){
              const loading = this.$loading(this.$store.state.loading);
              this.search.evaluation=id;
              this.tableData=[];
              this.rsIndex=idx;
              this.$CPOST('/relation/findEiVoList',{
                pageNum:1,
                pageSize:10,
                rsId:id
              },(res)=>{
                loading.close();
                let data=res.data.list,screen=0;
                  for(let j=0;j<data.length;j++){
                    let dfData=data[j].efAndWeightVoList;
                    for(let z=0;z<dfData.length;z++){
                      screen++
                      this.mergeLen=dfData[z].epAndWeightVoList.length;
                      let evData=dfData[z].epAndWeightVoList;
                      for(let c=0;c<evData.length;c++){
                        this.tableData.push({
                          // rsId:data[i].rsId,
                          // rsName:data[i].rsName,
                          screen:screen,
                          eiName:data[j].eiName,//被考核项名称
                          eiId:data[j].eiId,
                          eiCode:data[j].eiCode,//被考核项编号
                          efName:dfData[z].efName,//考核表
                          efId:dfData[z].efId,
                          efWeight:dfData[z].efWeight,//考核表权重
                          epName:evData[c].evaluationPeopleName,//考评人
                          epId:evData[c].evaluationPeopleId,
                          epWeight:evData[c].userWeight,//考评人权重
                          epCode:evData[c].evaluationPeopleCode
                        })
                      }
                    }
                  }
                this.page.total=res.data.total;
              })
            },
            add(){
              this.$router.push({path:'/index/addRelation'})
            },
            //分页
            currentC(page){
              this.rs=[];
              this.page.current=page;
              this.currentTable(page);
            },
            //附件上传
            /*fileBefore (file) {
              this.fileUpload.file=file;
            },*/
            httpRequest(){
              let fd = new FormData();
              fd.append('file', this.fileUpload.file)
              const loading = this.$loading(this.$store.state.loading);
              this.$CZC('/file/importRelastionship',fd,(res)=>{
                loading.close();
                if(res.code==200){
                  this.alert.text='上传成功';
                  this.alert.show=true;
                  this.alert.type='success';
                  currentTable(1)
                }else{
                  this.alert.text=res.msg;
                  this.alert.show=true;
                  this.alert.type='error';
                }
              })
            },
            fileBefore (file) {
              this.fileUpload.file=file;
            },
            //附件上传成功的数量
            fileSuccess(response, file, fileList){
              if(response.code==200){
                this.alert.text=response.msg
                this.alert.show=true;
                this.alert.type='success';
                this.currentTable(1);
              }else{
                this.alert.text=response.msg
                this.alert.show=true;
                this.alert.type='error';
              }
            },
            importI(){},
            //导出
            exportE(){
              var url=this.$http+'/file/exportRelationship?rsId='+this.checkList[0]+'&eiId='+this.search.coverName+'&evPeopleId='+this.search.examiner+'&efId='+this.search.surface;
              window.location.href=this.$http+'/file/exportRelationship?rsId='+this.checkList[0]+'&eiId='+this.search.coverName+'&evPeopleId='+this.search.examiner+'&efId='+this.search.surface;
            },
            //搜索
            searchS(val){
              const loading = this.$loading(this.$store.state.loading);
              this.$CPOST('/relation/findEiVoList',{
                pageNum:1,
                pageSize:5,
                rsId:val?'':this.search.evaluation,
                eiId:val?'':this.search.coverName,
                evPeopleId:val?'':this.search.examiner,
                efId:val?'':this.search.surface
              },(res)=>{
                loading.close();
                this.tableData=[];
                // this.rsIndex=8888;
                let num=0;
                let data=res.data.list,screen=0;
                  // for(let i=0;i<data.length;i++){
                  //   let eiData=data[i].eiVoList;
                    for(let j=0;j<data.length;j++){
                      let dfData=data[j].efAndWeightVoList;
                      for(let z=0;z<dfData.length;z++){
                        screen++
                        this.mergeLen=dfData[z].epAndWeightVoList.length;
                        let evData=dfData[z].epAndWeightVoList;
                        for(let c=0;c<evData.length;c++){
                          this.tableData.push({
                            // rsId:data[i].rsId,
                            // rsName:data[i].rsName,
                            screen:screen,
                            eiName:data[j].eiName,//被考核项名称
                            eiId:data[j].eiId,
                            eiCode:data[j].eiCode,//被考核项编号
                            efName:dfData[z].efName,//考核表
                            efId:dfData[z].efId,
                            efWeight:dfData[z].efWeight,//考核表权重
                            epName:evData[c].evaluationPeopleName,//考评人
                            epId:evData[c].evaluationPeopleId,
                            epWeight:evData[c].userWeight,//考评人权重
                            epCode:evData[c].evaluationPeopleCode
                          })
                        }
                      }
                      // this.checkList.push(j)
                    }
                    this.startInfo.rsId.push({
                      rsId:data[i].rsId
                    });
                  // }
                  this.page.total=res.data.total;
                  // this.startInfo.rsId=data[0].rsId;
              })
            },
            selec(val){
              this.startInfo.evId=val;
            },
            //开始考评
            start(){
              if(this.evaluationVal==''){
                this.alert.text='考评类型名称不能为空';
                this.alert.show=true;
                this.alert.type='error';
              }else{
                  if(this.checkList.length==0){
                    this.alert.text='请选择考评关系名称';
                      this.alert.show=true;
                      this.alert.type='error';
                  }else{
                    let check=this.checkList,arr=[];
                    for(let i=0;i<check.length;i++){
                      arr.push({
                        rsId:check[i]
                      })
                    }
                    this.$CPOST('/evaluate/evaluateStart',{
                      evId:this.startInfo.evId,
                      rsIds:JSON.stringify(arr)
                    },(res)=>{
                      if(res.code==200){
                        this.alert.text='成功开始考评';
                        this.alert.show=true;
                        this.alert.type='success';
                        this.checkList=[];
                        this.evaluationVal='';
                      }else{
                        this.alert.text=res.msg;
                        this.alert.show=true;
                        this.alert.type='error';
                      }
                    })
                  }
              }
            },
            currentData(){
              //请选择考评
              this.$CPOST('/evaluate/findMyEvaluate',{
              },(res)=>{
                let data=res.data.list;
                this.startInfo.evId=data[0].evId;
                for(let i=0;i<data.length;i++){
                  this.evaluationList.push({
                    id:data[i].evId,
                    name:data[i].evName
                  })
                }
                this.evaluationVal = this.evaluationList[0].id;
                const evId=this.$route.query.evId;
                if(evId!=undefined){
                  this.startInfo.evId=evId;
                  this.evaluationVal=evId;
                }
              });
              const loading = this.$loading(this.$store.state.loading);
              //考评关系渲染
              this.$CPOST('/relation/findMyRs',{

              },(res)=>{
                let data=res.data;
                for(let i=0;i<data.length;i++){
                  this.allCheck.push(data[i].rsId)
                  this.info.evaluationName.push({
                    value:data[i].rsName,
                    id:data[i].rsId
                  })
                }
              });
              //被考核项渲染
              this.$CPOST('/evaluateItem/findAll',{
              },(res)=>{
                let data=res.data;
                for(let i=0;i<data.length;i++){
                  this.info.coverName.push({
                    value:data[i].eiName,
                    id:data[i].eiId
                  })
                }
              });
              //考评人渲染
              this.$UPOST('/api/umc/user/findUserAll',{
                  pageNo:1,
                  pageSize:1000000
              },(res)=>{
                let data=res.data.list;
                for(let i=0;i<data.length;i++){
                  this.info.examiner.push({
                    value:data[i].userName,
                    id:data[i].userId
                  })
                }
              })
              //考核表渲染
              this.$CPOST('/evaluateForm/findEvaluateFormVo',{

              },(res)=>{
                let data=res.data;
                for(let i=0;i<data.length;i++){
                  this.info.surface.push({
                    value:data[i].efName,
                    id:data[i].efId
                  })
                }
              })
            },
            //就是那个表格
            currentTable(currentPage){
              const loading = this.$loading(this.$store.state.loading);
              this.tableData=[];
              this.$CPOST('/relation/findEiVoList',{
                rsId: this.search.evaluation,
                pageNum:currentPage,
                pageSize:10
              },(res)=>{
                  loading.close();
                  let data=res.data.list,screen=0;
                    for(let j=0;j<data.length;j++){
                      let dfData=data[j].efAndWeightVoList;
                      for(let z=0;z<dfData.length;z++){
                        screen++
                        this.mergeLen=dfData[z].epAndWeightVoList.length;
                        let evData=dfData[z].epAndWeightVoList;
                        for(let c=0;c<evData.length;c++){
                          this.tableData.push({
                            // rsId:data[i].rsId,
                            // rsName:data[i].rsName,
                            screen:screen,
                            eiName:data[j].eiName,//被考核项名称
                            eiId:data[j].eiId,
                            eiCode:data[j].eiCode,//被考核项编号
                            efName:dfData[z].efName,//考核表
                            efId:dfData[z].efId,
                            efWeight:dfData[z].efWeight,//考核表权重
                            epName:evData[c].evaluationPeopleName,//考评人
                            epId:evData[c].evaluationPeopleId,
                            epWeight:evData[c].userWeight,//考评人权重
                            epCode:evData[c].evaluationPeopleCode
                          })
                        }
                      }
                      // this.checkList.push(j)
                    }
                    this.startInfo.rsId.push({
                      rsId:data[i].rsId
                    });
                    this.rs.push({
                      rsId:data[i].rsId,
                      rsName:data[i].rsName
                    })
                  this.page.total=res.data.total;
              })
            },
            //合并
            mergeComon(id,rowIndex){
                var idName=this.tableData[rowIndex][id];
                if(rowIndex>0){
                  if(this.tableData[rowIndex][id] != this.tableData[rowIndex-1][id]){
                    var i = rowIndex,num = 0;
                    while(i<this.tableData.length){
                      if(this.tableData[i][id] === idName){
                        i++;
                        num++;
                      }else{
                        i=this.tableData.length
                      }
                    }
                    return {
                      rowspan:num,
                      colspan:1
                    }
                  }else{
                    return{
                      rowspan:0,
                      colspan:1
                    }
                  }
                }else{
                  var i = rowIndex,num = 0;
                  while(i<this.tableData.length){
                    if(this.tableData[i][id] === idName){
                      i++;
                      num++;
                    }else{
                      i=this.tableData.length
                    }
                  }
                  return {
                    rowspan:num,
                    colspan:1
                  }
                }
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }){
              switch(columnIndex){
                  // case 0:
                  // case 1:
                  // return this.mergeComon('rsId',rowIndex)
                  // break;
                  case 0:
                  case 1:
                  case 7:
                  return this.mergeComon('eiId',rowIndex)
                  break;
                  case 2:
                  case 3:
                  return this.mergeComon('screen',rowIndex)
                  break;
                }
            }
            //考评类型搜索相关
            // querySearchAsync(queryString, cb) {
            //     var evaluationName = this.info.evaluationName;
            //     var results = queryString ? evaluationName.filter(this.createStateFilter(queryString)) : evaluationName;
            //
            //     clearTimeout(this.timeout);
            //     this.timeout = setTimeout(() => {
            //       cb(results);
            //     }, 3000 * Math.random());
            // },
            // createStateFilter(queryString) {
            //   return (state) => {
            //     return (state.value?state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0:null);
            //   };
            // },
            // handleSelect(item) {
            //   this.search.evaluation=item.id;
            // },
            // querySearchAsyncC(queryString, cb) {
            //     var coverName = this.info.coverName;
            //     var results = queryString ? coverName.filter(this.createStateFilterC(queryString)) : coverName;
            //
            //     clearTimeout(this.timeout);
            //     this.timeout = setTimeout(() => {
            //       cb(results);
            //     }, 3000 * Math.random());
            // },
            // createStateFilterC(queryString) {
            //   return (state) => {
            //     return (state.value?state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0:null);
            //   };
            // },
            // handleSelectC(item) {
            //   this.search.coverName=item.id;
            // },
            // querySearchAsyncE(queryString, cb) {
            //     var examiner = this.info.examiner;
            //     var results = queryString ? examiner.filter(this.createStateFilterE(queryString)) : examiner;
            //
            //     clearTimeout(this.timeout);
            //     this.timeout = setTimeout(() => {
            //       cb(results);
            //     }, 3000 * Math.random());
            // },
            // createStateFilterE(queryString) {
            //   return (state) => {
            //     return (state.value?state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0:null);
            //   };
            // },
            // handleSelectE(item) {
            //   this.search.examiner=item.id;
            // },
            // querySearchAsyncS(queryString, cb) {
            //     var surface = this.info.surface;
            //     var results = queryString ? surface.filter(this.createStateFilterS(queryString)) : surface;
            //
            //     clearTimeout(this.timeout);
            //     this.timeout = setTimeout(() => {
            //       cb(results);
            //     }, 3000 * Math.random());
            // },
            // createStateFilterS(queryString) {
            //   return (state) => {
            //     return (state.value?state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0:null);
            //   };
            // },
            // handleSelectS(item) {
            //   this.search.surface=item.id;
            // },
        }
    }
</script>
<style>
  .el-upload-list{
    display: none;
  }
</style>
<style scoped='scoped'>
.el-upload-list,.el-checkbox__label{
    display: none !important;
  }
.zc-check span:last-child{
  display: none !important;
}
  .settingS-center{
    margin-top: 30px;
    display: flex;
  }
  .settingS-center button,.settingS-center div{
    margin-right: 10px;
  }
  .setting-table{
    height: 500px;
    display: flex;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .settingT-left{
    color: #909399;
    overflow-y:scroll;
    display: flex;
    background:#f8f8f8;
  }
  .settingT-left div{
    border: 1px solid #EBEEF5;
  }
  .settingT-left div ul li{
    border-bottom: 1px solid #EBEEF5;
    height: 58px;
    display: flex;
    align-items: center;
    padding: 12px 15px 12px 10px;
    font-size: 14px;
    color: #606266;
  }
  .settingT-left div ul li button{
    width: 100%;
  }
  .settingT-left div ul li div{
    border: none;
  }
  .second{
    width: 250px;
  }
  .second li{
    position: relative;
  }
  .second li span{
    display: inline-block;
    text-align: center;
    line-height: 12px;
    position: absolute;
    font-size: 12px;
    right: 1px;
    top: 2px;
    color: #fff;
    cursor: pointer;
    width: 15px;
    height: 15px;
    background: red;
    border-radius: 50%;
  }
  .settingT-left div:first-child{
    width: 50px;
  }
  .settingT-left p{
    border-bottom: 1px solid #EBEEF5;
    height: 48px;
    padding: 12px 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .rsActivity{
    background: #409EFF;
    color: #fff !important;
  }
  .settingS-top button{
    margin-right: 5px;
  }
</style>
