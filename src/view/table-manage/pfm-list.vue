<template>
  <el-container class="pfm-view" v-loading="loading">
    <el-header class="pfm-table__header" height="44px">
      <el-row :gutter="24">
        <el-col :span="4">
          <el-select v-model="search.eiId" size="small" clearable filterable placeholder="请选择被考核项">
            <el-option v-for="(item, index) in eiList" :key="index" :label="item.eiName" :value="item.eiId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-cascader placeholder="查询部门"
                      change-on-select
                      clearable
                      size="small"
                      :options="orgList"
                      :props="props"
                      v-model="search.orgId">
          </el-cascader>
        </el-col>
        <el-col :span="4">
          <el-select v-model="search.evId" size="small" clearable filterable placeholder="请选择考评">
            <el-option v-for="(item, index) in evalList" :key="index" :label="item.evName" :value="item.evId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="search.positionId" size="small" clearable filterable placeholder="请选择职级">
            <el-option v-for="item in stationList" :key="item.positionId" :label="item.positionName" :value="item.positionId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-sort" size="small" @click="handleSortBtnClick">{{isSort?'升序':'降序'}}</el-button>
        </el-col>
        <el-col :span="2">
          <el-button size="small" @click="handleExportBtnClick">导出</el-button>
        </el-col>
        <el-col :span="2">
          <el-button size="small" @click="handleSimpleExportBtnClick">简易导出</el-button>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="primary" @click="handleSearchBtnClick">搜索</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="pfm-table__main">
      <el-table :data="pfmTableList" height="100%" border style="width:100%;">
        <el-table-column label="姓名" prop="itemName" width="100px"></el-table-column>
        <el-table-column label="职位" prop="positonName" width="180px"></el-table-column>
        <el-table-column label="得分" min-width=300>
          <template slot-scope="props">
            <div class="score-view">
              <div class="score-item" v-for="(item, index) in props.row.epScoreVoList" :key="index">
                <div class="view-title">{{item.userName}}（{{item.userWeight*100}}%）</div>
                <div class="socre-count">{{item.userWeightScore}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评级" prop="socerLevel" width="100px"></el-table-column>
        <el-table-column label="总分" prop="totalScore" width="100px">
          <template slot-scope="scope">
            <el-input v-if="scope.row.show" size="small" v-model="scope.row.totalScore"
                      placeholder="调整总分">
            </el-input>
            <span v-if="!scope.row.show">{{scope.row.totalScore}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="155px">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleInfoBtnClick(scope.row)">详情</el-button>
            <el-button size="small" type="primary" @click="handleEditScoreBtnClick(scope.row)">{{scope.row.show?'关闭':'调分'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="pfm-table__footer" height="34px">
      <el-pagination  background
                      :page-size="10"
                      :current-page="search.pageNo"
                      layout="total, prev, pager, next"
                      :total="totalNumber"
                      @current-change="handlePageChangeClick">
      </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
import token from '@/assets/js/token';
export default {
  name: 'PfmTableView',
  data () {
    return {
      loading: false,
      pfmTableList: [], // 绩效总表数据
      evalList: [], // 考评列表
      stationList: [], // 职位列表
      orgList: [], // 部门数据
      eiList: [], //用户列表
      props: {
        value: 'orgId',
        label: 'orgName',
        children: 'children'
      }, // 联级选择器配置
      search: {
        pageNo: 1,
        pageSize: 10,
        eiId: '',
        orgId: [],
        evId: '',
        positionId: '',
        order: 'asc'
      }, // 搜索参数
      totalNumber: 0, // 总数
      isSort: false, // 排序
      maxScore: 0,
      minScore: 0
    };
  },
  mounted () {
    this.getAllData();
  },
  methods: {
    getAllData () {
      Promise.all([this.getEvaluateList()]).then(res => {
        this.getPfmTableList();
      });
      this.getEiList();
      this.getOrgList();
      this.getStatoinList();
    },
    /**
     * @description: 获取部门列表
     */
    getOrgList () {
      let _data = {
        token: '1'
      };
      this.$axios.get('/api/umc/orignization/findOrgTree', _data).then(res => {
        if (res.data.code === 200) {
          this.orgList = res.data.data;
        }
      });
    },
    getEiList () {
      let _data = {};
      this.$CGET('/evaluateItem/findAll', _data, res => {
        if (res.code === 200) {
          this.eiList = res.data;
        }
      }, err => {});
    },
    getEvaluateList () {
      return new Promise((resolve, reject) => {
        // evaluate/findMyEvaluate
        this.$CPOST('/evaluate/findMyEvaluate', {}, res => {
          if (res.code === 200) {
            this.evalList = res.data.list;
            this.search.evId = this.evalList[0].evId;
          }
          resolve(res);
        }, err => {
          reject(err);
        })
      });
    },
    /**
     * @description: 获取职级列表
     */
    getStatoinList () {
      this.$axios.get('/api/umc/position/findPositionAll', {}).then(res => {
        if (res.data.code === 200) {
          this.stationList = res.data.data;
        }
      });
    },
    /**
     * @description: 获取绩效总表数据
     */
    getPfmTableList () {
      this.loading = true;
      this.search.order = this.isSort ? 'asc' : 'desc';
      let _data = {};
      for (const key in this.search) {
        if (Array.isArray(this.search[key])) {
          this.search[key].length ? (key === 'orgId' ? _data[key] = this.search[key][this.search[key].length - 1] : _data[key] = this.search[key]) : '';
        } else {
          this.search[key] ? _data[key] = this.search[key] : '';
        }
      }
      this.$CGET('/score/findTotalScoreList', _data, res => {
        if (res.code === 200) {
          let result = res.data.list;
          if (result && Array.isArray(result) && result.length) {
            this.totalNumber = res.data.total;
            result.forEach(t => {
              t.show = false;
            });
            this.pfmTableList = result;
          } else {
            this.totalNumber = 0;
            this.pfmTableList = [];
          }
        }
        this.loading = false;
      }, err => {});
    },
    exportTableData (url, params, type) {
      let form = document.createElement('form');
      form.method = type;
      form.action = url;
      for (const key in params) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', params[key]);
        form.appendChild(input);
      };
      document.body.appendChild(form);
      form.submit();
      form.parentNode.removeChild(form);
    },
    /**
     * @description: 排序点击事件
     */
    handleSortBtnClick () {
      this.isSort = !this.isSort;
      this.getPfmTableList();
    },
    submitDataCheck (isSimple = false) {
      const _data = {
        token,
        simple: isSimple
      };
      for (const key in this.search) {
        if (Array.isArray(this.search[key])) {
          this.search[key].length ? (key === 'orgId' ? _data[key] = this.search[key][this.search[key].length - 1] : _data[key] = this.search[key]) : '';
        } else {
          this.search[key] ? _data[key] = this.search[key] : '';
        }
      }
      let arr = ['pageNo', 'pageSize'];
      arr.forEach(t => {
        if (_data.hasOwnProperty(t)) {
          Reflect.deleteProperty(_data, t);
        }
      });
      return _data;
    },
    /**
     * @description: 导出点击事件
     */
    handleExportBtnClick () {
      const _data = this.submitDataCheck();
      this.exportTableData('/api/emc/file/exportTotalScore', _data, 'post');
    },
    /**
     * @description: 简易导出
     */
    handleSimpleExportBtnClick () {
      const _data = this.submitDataCheck(true);
      this.exportTableData('/api/emc/file/exportTotalScore', _data, 'post');
    },
    /**
     * @description: 搜索事件
     */
    handleSearchBtnClick () {
      this.getPfmTableList();
    },
    /**
     * @description: 分页点击事件
     */
    handlePageChangeClick (currentPage) {
      this.search.pageNo = currentPage;
      this.getPfmTableList();
    },
    handleEditScoreChange (item) {
      if (item.totalScore >= this.minScore && item.totalScore <= this.maxScore) {
        // item.show = false;
        // this.$CPOST('/score/designateScore', {
        //   scoreTotalId: item.scoreTotalId,
        //   score: item.totalScore
        // }, res => {});
      } else {
        item.totalScore = item.totalScore > this.maxScore ? this.maxScore : (item.totalScore < this.minScore) ? this.minScore : item.totalScore
      }
    },
    /**
     * @description: 点击表格详情
     */
    handleInfoBtnClick (item) {
      this.$router.push({
        name: 'EmcInfo',
        query: {
          evId: item.evId,
          eiId: item.itemId,
          rsId: item.rsId
        }
      })
    },
    handleEditScoreBtnClick (item) {
      // this.$CPOST('/evaluate/findEvaluate', {
      //   evId: item.evId
      // }, res => {
      //   this.maxScore = res.data.maxScore;
      //   this.minScore = res.data.minScore;
      // });
      item.show = !item.show;
      if (item.show === false) {
        this.$CPOST('/score/designateScore', {
          scoreTotalId: item.scoreTotalId,
          score: item.totalScore
        }, res => {
          if (res.code  ==  200) {
            this.getPfmTableList();
          } else {
            this.$message.error(res.msg);
            this.getPfmTableList();
          }
        });
      }
    }
  }
}
</script>
<style <style lang="scss">
.pfm-view {
  height: 100%;
  width: 100%;
}
.pfm-table__header {
  width: 100%;
}
.pfm-table__main {
  height: calc(100% - 78px);
  width: 100%;
}
.score-view {
  display: flex;
  width: 100%;
  .score-item {
    flex: 1;
  }
}
</style>
