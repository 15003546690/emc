<template>
  <div class="indicators">
    <div class='settingS-top'>
      <el-select v-model="evaluationVal" placeholder="请选择考评" filterable clearable>
        <el-option
          v-for="(s,index) in evaluationList"
          :key='index'
          :label="s.name"
          :value="s.id">
        </el-option>
      </el-select>
      <el-upload
        class="setting-upload"
        style='margin-right: 0'
        :http-request='httpRequest'
        action=""
        accept=".xls,.xlsx"
        :before-upload="fileBefore"
        :show-file-list=false>
        <el-button type='primary'>导入</el-button>
      </el-upload>
    </div>
    <div class="indicators-search">
      <el-input placeholder='请输入姓名' v-model='userName'></el-input>
      <el-input placeholder='请输入项目名称' v-model='projectName'></el-input>
      <el-button type='primary' @click='search()'>搜索</el-button>
      <el-button type='primary' @click='exportE()'>导出</el-button>
    </div>
    <div class="indicators-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="userNumber"
          label="工号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目">
        </el-table-column>
        <el-table-column
          prop="score"
          label="得分">
        </el-table-column>
      </el-table>
    </div>
    <div class="zc_page" v-show='page.total>0'>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size='page.pageSize'
        :current-page='page.current'
        @current-change='nextPage'
        :total='this.page.total'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
	created(){
    this.currentD();
	},
  data () {
    return {
      fileUpload:{   //附件上传
        file:null
      },
      userName:'',
      page:{
        current:1,
        pageSize:10,
        total:0
      },
      projectName:'',
      evaluationVal:'',
      evaluationList:[],
      tableData: []
    }
  },
  methods:{
    //导出
    exportE(){
      var url=this.$http+'/file/exportRefer?userName='+this.userName+'&&projectName='+this.projectName+'&&evId='+this.evaluationVal;
      window.location.href=url;
    },
    search(){
      this.page.current=1;
      this.tableD();
    },
    //下一页
    nextPage(_d){
      this.page.current=_d;
      this.tableD();
    },
    tableD(){
      this.$CPOST('/refer/findAllReferPage',{
        pageNum:this.page.current,
        pageSize:this.page.pageSize,
        userName:this.userName,
        projectName:this.projectName,
        evId:this.evaluationVal
      },(res)=>{
        this.tableData=res.data.list;
        this.page.total=res.data.total;
      })
    },
    httpRequest(){
        let fd = new FormData();
        fd.append('file', this.fileUpload.file);
        fd.append('evId', this.evaluationVal)
        const loading = this.$loading(this.$store.state.loading);
        this.$CZC('/file/importRefer',fd,(res)=>{
          loading.close();
          if(res.code!=200){
            this.$message.error(res.msg);
          }else{
            this.tableD();
          }
        })
    },
    fileBefore (file) {
      if(this.evaluationVal==''){
        this.$message.error('请选择考评')
      }else{
        this.fileUpload.file=file;
      }
    },
    currentD(){
      //请选择考评
      this.$CPOST('/evaluate/findMyEvaluate',{
      },(res)=>{
        let data=res.data.list;
        for(let i=0;i<data.length;i++){
          this.evaluationList.push({
            id:data[i].evId,
            name:data[i].evName
          })
        }
        this.evaluationVal = this.evaluationList[0].id;
        this.tableD();
      });
    }
  }
}
</script>


<style scoped>
.indicators{
  padding: 0 30px;
}
.indicators-search .el-input{
  width: 217px;
  margin-right: 20px;
}
.indicators-search{
  display: flex;
  margin: 20px 0;
}
.settingS-top{
  display: flex;
}
.settingS-top .el-button{
  margin-left: 20px;
}
.zc_page{
    display: flex;
    justify-content: flex-end;
    margin-top: 57px;
}
</style>
