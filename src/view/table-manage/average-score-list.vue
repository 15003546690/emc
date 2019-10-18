<template>
  <el-container class="average-score-list" v-loading="loading">
    <el-header class="average-score-list__header">
      <div class="header-inner">
        <div class="search-item">
          <el-select v-model="search.userId" size="small" filterable clearable placeholder="请选择评分人">
            <el-option v-for="(item, index) in userList"
                      :key="index"
                      :label="item.userName"
                      :value="item.userId">
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-select v-model="search.evId" size="small" filterable clearable placeholder="请选择考评">
            <el-option v-for="(item, index) in evList"
                      :key="index"
                      :label="item.evName"
                      :value="item.evId">
            </el-option>
          </el-select>
        </div>
        <div class="search-item" v-if="false">
          <el-select v-model="search.eiId" size="small" filterable clearable placeholder="请选择被考评用户">
            <el-option v-for="(item, index) in eiList"
                      :key="index"
                      :label="item.eiName"
                      :value="item.eiId">
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-select v-model="search.efId" size="small" filterable clearable placeholder="请选择考核表">
            <el-option v-for="(item, index) in efList"
                      :key="index"
                      :label="item.efName"
                      :value="item.efId">
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-select v-model="search.rsId" size="small" filterable clearable placeholder="请选择考核关系">
            <el-option v-for="(item, index) in rsList"
                      :key="index"
                      :label="item.rsName"
                      :value="item.rsId">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="search-btns">
        <div class="">
          <el-button icon="el-icon-sort" size="small" @click="handleSortBtnClick">{{search.order === 'asc'?'升序':'降序'}}</el-button>
          <el-button size="small" type="primary" @click="handleSearchBtnClick">搜索</el-button>
        </div>
      </div>
    </el-header>
    <el-main class="average-score-list__main">
      <el-table :data="averageSocreList" border style="width:100%;">
        <el-table-column label="名称" prop="userName" width="150px"></el-table-column>
        <el-table-column label="职位" prop="positionName"></el-table-column>
        <el-table-column label="考核关系表" prop="rsName"></el-table-column>
        <el-table-column label="平均分" prop="avgScore"></el-table-column>
      </el-table>
    </el-main>
    <el-footer class="rage-score-list__footer" height="34px">
      <el-pagination  background
                      :page-size="search.pageSize"
                      :current-page="search.pageNo"
                      layout="total, prev, pager, next"
                      :total="totalNumber"
                      @current-change="handlePageChangeClick">
      </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      loading: false,
      averageSocreList: [],
      evList: [],
      eiList: [],
      efList: [],
      rsList: [],
      userList: [],
      totalNumber: 0,
      search: {
        pageNum: 1,
        pageSize: 10,
        userId: '', // 评分人id
        eiId: '', // 被考核项id
        evId: '', // 考评ID
        efId: '', // 考核表id
        rsId: '', // 考核关系id
        order: 'asc' // 排序
      }
    };
  },
  mounted () {
    this.getUserList();
    this.getEvidList();
    this.getEiList();
    this.getEfList();
    this.getRsidList();
  },
  methods: {
    getScoreList () {
      this.loading = true;
      this.$CPOST('/score/findGradeAvgScore', this.search, res => {
        let result = res.data.list;
        this.totalNumber = res.data.total;
        if (result && Array.isArray(result) && result.length) {
          this.averageSocreList = result;
        } else {
          this.averageSocreList = [];
        }
        this.loading = false;
      });
    },
    getUserList () {
      this.$axios.get('/api/umc/user/findUserAll').then(res => {
        let data = res.data.data.list;
        if (data && Array.isArray(data) && data.length) {
          this.userList = data;
        } else {
          this.userList = [];
        }
      });
    },
    getEvidList () {
      // /evaluate/findAllEvaluate
      this.$CGET('/evaluate/findMyEvaluate', {
        },(res) => {
          let data = res.data.list;
          if (data && Array.isArray(data) && data.length) {
            this.evList = data;
            this.search.evId = data[0].evId;
          this.getScoreList();
          } else {
            this.evList = [];
          }
        });
    },
    getEiList () {
      this.$CGET('/evaluateItem/findAll', {}, res => {
        let data = res.data;
        if (data && Array.isArray(data) && data.length) {
          this.eiList = data;
        } else {
          eiList = [];
        }
      });
    },
    getEfList () {
      this.$CGET('/evaluateForm/findEvaluateFormVo', {}, res => {
        let data = res.data;
        if (data && Array.isArray(data) && data.length) {
          this.efList = data;
        } else {
          eiList = [];
        }
      });
    },
    getRsidList () {
      this.$CGET('/relation/findAboutMeRelationship', {
				},(res) => {
        let data = res.data;
        if (data && Array.isArray(data) && data.length) {
          this.rsList = data;
        } else {
          this.rsList = [];
        }
      })
    },
    handlePageChangeClick (page) {
      this.search.pageNum = page;
      this.getScoreList();
    },
    handleSortBtnClick () {
      this.search.order = this.search.order === 'asc' ? 'desc' : 'asc';
      this.getScoreList();
    },
    handleSearchBtnClick () {
      this.getScoreList();
    }
  }
}
</script>
<style scoped>
.average-score-list {
  height: 100%;
  width: 100%;
}
.average-score-list__header {
  display: flex;
  justify-content: space-between;
}
.header-inner {
  display: flex;
}
.search-btns {
  width: 170px;
}
.search-item {
  width: 15%;
  margin-right: 5px;
}
.average-score-list__main {
  height: calc(100% - 94px);
  width: 100%;
}
.average-score-list__footer {}
</style>
