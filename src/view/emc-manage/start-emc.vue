<template>
    <div>
      <div class="start-info">
          <div class='startI-left'>
              <div>
                  <p><i>*</i><span>考评名称：</span><el-input placeholder="考评名称" v-model='info.evaluationName'></el-input></p>
                  <!-- <p>
                      <span>总结提交日期：</span>
                      <el-date-picker
                        v-model="info.summaryDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期">
                      </el-date-picker>
                  </p> -->
                  <p>
                      <i>*</i>
                      <span>评分开始日期：</span>
                      <el-date-picker
                        v-model="info.startTime"
                        type="datetime"
                        :picker-options="pickerBeginDateBefore"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="开始日期">
                      </el-date-picker>
                  </p>
              </div>
              <div>
                  <p class="start-select">
                      <i>*</i>
                      <span>发起类型：</span>
                      <el-select v-model="info.typeName" placeholder="请选择" filterable clearable>
                        <el-option
                          v-for="(item,index) in launchList"
                          :key='index'
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                  </p>
                  <p>
                      <i>*</i>
                      <span>评分结束日期：</span>
                      <el-date-picker
                        v-model="info.endTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerBeginDateAfter"
                        placeholder="结束日期">
                      </el-date-picker>
                  </p>
              </div>
              <div>
                  <p class="start-select">
                      <i>*</i>
                      <span>考评类型：</span>
                      <el-select v-model="info.evaluationType" placeholder="请选择" filterable clearable>
                        <el-option
                          v-for="(item,index) in evaluationList"
                          :key='index'
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                  </p>
                  <p style="width: 347px;">
                    <i></i>
                    <span style="margin-right: 8px;">&nbsp&nbsp&nbsp指导语：</span>
                    <el-input
                      type="textarea"
                      :rows="1"
                      placeholder="请输入内容"
                      resize='none'
                      v-model="info.textarea">
                    </el-input>
                  </p>
              </div>
              <div>
                <p class="start-date">
                  <i>*</i>
                  <span style="width:120px;min-width:125px;">调分结束日期：</span>
                  <el-date-picker
                    v-model="info.desiScoreTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerBeginDateAfter"
                    placeholder="结束日期">
                  </el-date-picker>
                </p>
              </div>
              <!-- <div>
                <p>
                    <span>&nbsp&nbsp&nbsp指导语：</span>
                    <el-input
                      type="textarea"
                      :rows="1"
                      placeholder="请输入内容"
                      resize='none'
                      v-model="info.textarea">
                    </el-input>
                </p>
              </div> -->
          </div>
          <div class="startI-right">
              <p>
                  <i>*</i>
                  <span>分值设置：</span>
                  <el-input v-model="info.leftVal" placeholder="请输入内容" @input='changeNum(info.leftVal,"left")' ></el-input>-
                  <el-input v-model="info.rightVal" placeholder="请输入内容" @input='changeNum(info.rightVal,"right")' ></el-input>
              </p>
              <p style="display:flex;">
                <i>*</i>
                <label style="display:block;width:100%;">
                  <span style="width:40px;">评级：</span>
                  <el-select v-model="info.levelId">
                    <el-option v-for="(item, index) in levelList"
                              :key="index"
                              :label="item.levelName"
                              :value="item.levelId">
                    </el-option>
                  </el-select>
                </label>
              </p>
              <p class="start-check">
                <i></i>
                <label style="display:block;width:100%;">
                  <span>评语是否可以对被评分人可见：</span>
                  <el-checkbox v-model="info.checked"></el-checkbox>
                </label>
              </p>
          </div>
      </div>
      <div class="start-btn">
          <el-button type="primary" @click='nextBtn()'>下一步</el-button>
      </div>
      <div class="start-table">
          <div class="startT-title">我发起的考评</div>
          <el-table
              :data="tableData"
              border
              >
              <el-table-column
                prop="evName"
                label="考评名称">
                <template slot-scope='scope'>
                  <el-input v-if='scope.row.show' v-model='scope.row.evName'></el-input>
                  <span v-else>{{scope.row.evName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="etName"
                label="考评类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.etId" placeholder="请选择" filterable clearable v-if="scope.row.show&&scope.row.status=='未开始'">
                    <el-option
                      v-for="(item,index) in evaluationList"
                      :key='index'
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <span v-else>{{scope.row.etName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="ltName"
                label="发起类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.ltId" placeholder="请选择" filterable clearable v-if="scope.row.show&&scope.row.status=='未开始'">
                        <el-option
                          v-for="(item,index) in launchList"
                          :key='index'
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                  <span v-else>{{scope.row.ltName}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="summarizeTime"
                label="总结提交日期">
                <template slot-scope="scope">
                  <el-input v-if='scope.row.show' v-model='scope.row.gradeStartTime'></el-input>
                  <el-date-picker
                    v-if='scope.row.show'
                    v-model="scope.row.summarizeTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择开始日期">
                  </el-date-picker>
                  <span v-else>{{scope.row.summarizeTime}}</span>
                </template>
              </el-table-column> -->
              <el-table-column
                prop="gradeStartTime"
                label="评分开始日期"
                width='110'>
                <template slot-scope="scope">
                  <!-- <el-input v-if='scope.row.show' v-model='scope.row.gradeStartTime'></el-input> -->
                  <el-date-picker
                    v-if='scope.row.show'
                    v-model="scope.row.gradeStartTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期">
                  </el-date-picker>
                  <span v-else>{{scope.row.gradeStartTime}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="gradeEndTime"
                label="评分结束日期"
                width='110'>
                <template slot-scope="scope">
                  <!-- <el-input v-if='scope.row.show' v-model='scope.row.gradeEndTime'></el-input> -->
                  <el-date-picker
                    v-if='scope.row.show'
                    v-model="scope.row.gradeEndTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择结束日期">
                  </el-date-picker>
                  <span v-else>{{scope.row.gradeEndTime}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                label="指导语">
                <template slot-scope="scope">
                  <el-input v-if='scope.row.show' v-model='scope.row.remark'></el-input>
                  <span v-else>{{scope.row.remark}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="desiScoreTime" label="调分结束日期"  width='110'>
                <template slot-scope="scope">
                  <el-date-picker
                    v-if="scope.row.show"
                    v-model="scope.row.desiScoreTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerBeginDateAfter"
                    placeholder="结束日期">
                  </el-date-picker>
                  <span v-else>{{scope.row.desiScoreTime}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="levelId" label="评级">
                <template slot-scope="scope">
                  <el-select v-if='scope.row.show' v-model="scope.row.levelId">
                    <el-option v-for="(item, index) in levelList"
                              :key="index"
                              :label="item.levelName"
                              :value="item.levelId">
                    </el-option>
                  </el-select>
                  <span v-else>{{scope.row.levelName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop='status'
                label="考评状态">
                <!-- <template slot-scope="scope">
                  <span>{{scope.row.status}}</span>
                </template> -->
              </el-table-column>
              <el-table-column
                label="操作"
                width='160'>
                <template slot-scope="scope">
                  <div title='删除'  class='iconfont icon-shanchu zc-btn' @click="dele(scope.$index, scope.row)" style="color: red"></div>
                  <div title='编辑'  class='iconfont icon-bianji zc-btn' @click="handleEdit(scope.$index, scope.row)" ></div>
                  <div title="发起" class="iconfont icon-faqi zc-btn" @click="launch(scope.$index, scope.row)"></div>
                  <!-- <el-button
                    size="mini"
                    @click="launch(scope.$index, scope.row)">发起</el-button> -->
                  <el-switch
                    v-if="scope.row.status=='考评开始'||scope.row.status=='考评结束'"
                    @change='tabSwitch(scope)'
                    v-model="scope.row.status=='考评结束'?false:true"
                    active-color="#409EFF"
                    inactive-color="#ff4949">
                  </el-switch>
                  <!--<el-button size="small" @click="handleStartRate(scope)">开始评级</el-button>-->
                </template>
              </el-table-column>
              <!-- 将来的编辑功能 -->
              <!-- <el-table-column label="操作" min-width=180>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">{{scope.row.key}}</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column> -->
          </el-table>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size='5'
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
    components: {
      Layer
    },
    created () {
      this.currentData();
    },
    data () {
      return {
        alert: {
          text: '保存成功', // 提示的文字
          show: false, // 显示隐藏
          type: 'success' // 显示类型
        },
        page: {
          current: 1,
          total: null
        },
        info: {
          evaluationName: '',
          typeName: '',
          evaluationType: '',
          textarea: '',
          summaryDate: '',
          startTime: '',
          endTime: '',
          checked: false,
          leftVal: 0,
          rightVal: 10,
          desiScoreTime: '',
          levelId: ''
        },
        levelList: [], // 评级
        tableData:[],
        launchList:[], // 发起类型列表
        evaluationList:[], // 考评类型列表
        //start、end,dateSetting
        pickerBeginDateBefore: {
          disabledDate: (time) => {
              let beginDateVal = this.info.endTime;
              if (beginDateVal) {
                return time.getTime() > beginDateVal;
              }
          }
          },
        pickerBeginDateAfter: {
          disabledDate: (time) => {
            let beginDateVal = this.info.startTime;
            if (beginDateVal) {
              return time.getTime() < beginDateVal;
            }
          }
        }
      }
    },
    methods: {
      //删除
      dele(index,_d){
        this.$alert('确定要删除吗？', '', {
          confirmButtonText: '确定',
          callback: action => {
            if(action=='confirm'){
              this.$CPOST('/evaluate/delEvaulte',{
                evId:_d.evId
              },(res)=>{
                if(res.code==200){
                  this.tableData.splice(index,1);
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
      aAalert(val){
        this.alert.text=val;
        this.alert.show=true;
        this.alert.type='error';
      },
      //下一步
      nextBtn(){
        /*else if(this.info.summaryDate==''){
          this.aAalert('总结提交日期不能为空');
        }*/
        if(this.info.evaluationName==''){
          this.aAalert('考评名称不能为空');
        }else if(this.info.typeName==''){
          this.aAalert('发起类型不能为空');
        }else if(this.info.evaluationType==''){
          this.aAalert('考评类型不能为空');
        }else if(this.info.startTime==''){
          this.aAalert('评分开始日期不能为空');
        }else if(this.info.endTime==''){
          this.aAalert('评分结束日期不能为空');
        }else if(this.info.leftVal>this.info.rightVal){
          this.alert.text='分值范围设置不正确';
          this.alert.show=true;
          this.alert.type='error';
        }else if (!this.info.levelId) {
          this.aAalert('评级不能为空');
        } else if (!this.info.desiScoreTime) {
          this.aAalert('调分结束日期');
        } else {
          let data = this.info.checked, open = 0;
          if (this.data) {
            open = 0;
          } else {
            open = 1;
          }
          this.$CPOST('/evaluate/addEvaulte',{
              evName:this.info.evaluationName,
              // summarizeTime:this.info.summaryDate,
              gradeStartTime:this.info.startTime,
              gradeEndTime:this.info.endTime,
              openComment:open,
              minScore:this.info.leftVal,
              maxScore:this.info.rightVal,
              ltId:this.info.typeName,
              etId:this.info.evaluationType,
              remark:this.info.textarea,
              desiScoreTime: this.info.desiScoreTime,
              levelId: this.info.levelId
          }, (res) => {
              if(res.code==200){
                this.info.evaluationName='';
                this.info.summaryDate='';
                this.info.startTime='';
                this.info.endTime='';
                this.info.leftVal='';
                this.info.rightVal='';
                this.info.typeName='';
                this.info.evaluationType='';
                this.info.checked=false;
                this.info.textarea='';
                this.$router.push({path:'/index/emcSetting', query: {evId: res.data}})
                // this.currentData();
              }else{
                this.alert.text=res.msg;
                this.alert.show=true;
                this.alert.type='error';
              }
          })
        }
      },
      //发起
      launch(index,row){
        this.$router.push({path:'/index/emcSetting', query: {evId: row.evId}});
      },
      //编辑
      handleEdit(index, row){
        if(row.key=='编辑'){
          row.show=true;
          row.key='保存'
        }else{
          let status=row.status;
          if(status=='未开始'){
            status=0;
          }else if(status=='考评开始'){
            status=1;
          }else{
            status=2;
          }
          this.$CPOST('/evaluate/updateEvaulte',{
            evId:row.evId,
            evName:row.evName,
            // summarizeTime:row.summarizeTime,
            gradeStartTime:row.gradeStartTime,
            gradeEndTime:row.gradeEndTime,
            openComment:row.openComment,
            ltId:row.ltId,
            etId:row.etId,
            status:status,
            remark:row.remark,
            desiScoreTime: row.desiScoreTime,
            levelId: row.levelId
          }, (res) => {
            if (res.code === 200) {
              this.currentList(this.page.current);
            }
          })
          row.show=false;
          row.key='编辑'
        }
      },
      handleStartRate ({row}) {
        this.$CPOST('/level/startLevel', {evId: row.evId}, res => {
          this.alert = {
            text: res.msg,
            show: true,
            type: 'success'
          };
        }, err => {
          this.alert = {
            text: res.msg,
            show: true,
            type: 'error'
          };
        });
      },
      //input操作
      changeNum(val,position){
        let reg=/^[0-9]*$/;
        let cont=reg.test(val);
        if(position=='left'){
          if(val=='' || !cont){
            this.info.leftVal=0;
          }
        }else{
          if(!cont){
            this.info.rightVal=10;
          }
        }
      },
      currentData(){
        //发起类型
        this.$CPOST('/launchType/findAllLaunchType',{
        },(res)=>{
          let data=res.data.list;
          for(let i=0;i<data.length;i++){
            this.launchList.push({
              id:data[i].ltId,
              name:data[i].ltName
            })
          }
        })
        //考评类型
        this.$CPOST('/evaluateType/findAllEvaluateType',{
        },(res)=>{
          let data=res.data.list;
          for(let i=0;i<data.length;i++){
            this.evaluationList.push({
              id:data[i].etId,
              name:data[i].etName
            })
          }
        });
        this.$CPOST('/level/findMyLevel', {}, res => {
          if (res.code === 200) {
            const result = res.data;
            if (result && Array.isArray(result) && result.length) {
              this.levelList = result;
            } else {
              this.levelList = [];
            }
          }
        });
        this.currentList(1);
      },
      currentList(currentPage){
        this.tableData=[];
        //列表渲染
        this.$CPOST('/evaluate/findMyEvaluate',{
          pageNum:currentPage,
          pageSize:5
        },(res)=>{
          let data=res.data.list,status;
          this.page.total=res.data.total;
          for(let i=0;i<data.length;i++){
            if(data[i].status==0){
              status='未开始';
            }else if(data[i].status==1){
              status='考评开始'
            }else{
              status='考评结束'
            }
            this.tableData.push({
                show:false,
                evId:data[i].evId,
                evName:data[i].evName,
                etName:data[i].etName,
                etId:data[i].etId,
                ltName:data[i].ltName,
                ltId:data[i].ltId,
                key:'编辑',
                summarizeTime:data[i].summarizeTime,
                gradeStartTime:data[i].gradeStartTime,
                gradeEndTime:data[i].gradeEndTime,
                remark:data[i].remark,
                status:status,
                openComment:data[i].openComment,
                levelId: data[i].levelId,
                levelName: data[i].levelName,
                desiScoreTime: data[i].desiScoreTime
            })
          }
        })
      },
      //分页
      currentC(page){
        this.page.current=page;
        this.currentList(page);
      },
      tabSwitch(val){
        let id=val.row.evId,status;
        if(val.row.status=='考评开始'){
          status=2;
        }else if(val.row.status=='考评结束'){
          status=1;
        }
        this.$CPOST('/evaluate/evaluateOnOff',{
          evId:id,
          status:status
        },(res)=>{
          let status= val.row.status;
          if(status=='考评开始'){
            val.row.status='考评结束';
          }else{
            val.row.status='考评开始';
          }
        })
      }
    }
  }
</script>
<style scoped='scoped'>
  .start-info{
    width: 100%;
    padding: 20px 10px;
    border:1px solid #eee;
    display: flex;
    margin-top: 30px;
    border-radius: 10px 10px 0 0;
    margin-bottom: 10px;
  }
  .startI-left{
    width: 70%;
  }
  .startI-left div{
    display: flex;
  }
  .startI-left div p{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
    font-size: 14px;
  }
  .start-select .el-select,.startI-left div p input{
    max-width: 202px;
  }
  .start-date .el-date-editor{
    max-width: 202px;
  }
  .startI-left div p:first-child{
    margin-right: 50px;
    font-size: 14px;
  }
  .startI-left div p i,.startI-right p i{
    display: inline-block;
    font-style:normal;
    margin-right: 10px;
    display: flex;
    align-items: center;
    color: red;
  }
  .startI-left div p span{
    display: inline-block;
    min-width: 125px;
  }
  .startI-right{
    flex: 1
  }
  .startI-right p{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
    font-size: 14px;
  }
  .startI-right p span{
    display: inline-block;
    min-width: 85px;
  }
  .startI-left div:last-child{
    min-width: 202px;
  }
  .start-btn{
    padding: 0 0 20px 0;
    width: 100%;
    display: flex;
    justify-content: center;
    border-radius: 0 0 10px 10px;
  }
  .start-btn button{
    width: 200px;
  }
  .start-table{
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .startT-title{
    padding: 10px;
    color: #909399;
    border: 1px solid #EBEEF5;
    border-bottom: none;
    font-weight: bold;
    font-size: 15px;
  }
  .start-check {
    display: flex;
    align-items: center;
    height: 40px;
  }
</style>
