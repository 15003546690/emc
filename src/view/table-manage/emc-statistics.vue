<template>
<el-container class="st-view" v-loading="loading">
  <el-header class="st-view__header" height="44px">
    <el-row :gutter="24">
      <el-col :span="4">
        <el-select v-model="search.name" size="small" clearable filterable placeholder="请选择用户">
          <el-option v-for="(item, index) in userList" :key="index" :label="item.userName" :value="item.userId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-cascader placeholder="查询部门"
                    change-on-select
                    clearable
                    size="small"
                    :options="departmentDataSource"
                    :props="props"
                    v-model="search.orgId">
        </el-cascader>
      </el-col>
      <el-col :span="4">
        <el-select v-model="search.evId" size="small" filterable placeholder="请选择考评">
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
        <el-button size="small" type="primary" @click="handleSearchBtnClick">搜索</el-button>
      </el-col>
    </el-row>
  </el-header>
  <el-main class="st-view__main" style='min-height: 447px;display: flex;'>
    <div class="main-bar" id="barCharts"></div>
    <div class="main-pie" id="pieCharts"></div>
    <!-- <div class="data-none" v-show="!chartShow">暂无数据</div> -->
  </el-main>
  <el-footer height="34px">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalNumber"
      :page-size="search.pageSize"
      :current-page.sync="search.pageNo"
      @current-change="handleCurrentPageChange">
    </el-pagination>
  </el-footer>
</el-container>
</template>
<script>
import echarts from 'echarts';
export default {
  name: 'StatisticsView',
  data () {
    return {
      loading: false,
      userList: [],
      evalList: [],
      stationList: [],
      departmentDataSource: [],
      pfmTableList: [],
      props: {
        value: 'orgId',
        label: 'orgName',
        children: 'children'
      },
      totalNumber: 0,
      search: {
        name: '',
        orgId: [],
        positionId: '',
        evId: '',
        order: 'asc',
        pageNo: 1,
        pageSize: 10
      }, // 搜索参数
      isSort: false,
      chartShow: false
    };
  },
  mounted () {
    this.getAllData();
  },
  methods: {
    getAllData () {
      this.getOrgList();
      this.getStatoinList();
      this.getEvaluateList();
      this.getUserList();
    },
    getUserList () {
      this.$axios.get('/api/umc/user/findUserAll', {}).then(res => {
        if (res.data.code === 200) {
          this.userList = res.data.data.list;
        }
      });
    },
    getEvaluateList () {
      this.$CPOST('/evaluate/findMyEvaluate', {}, res => {
        if (res.code === 200) {
          this.evalList = res.data.list;
          this.search.evId = this.evalList[0].evId;
          this.getPfmTableList();
        }
      }, err => {})
    },
    getStatoinList () {
      this.$axios.get('/api/umc/position/findPositionAll', {}).then(res => {
        if (res.data.code === 200) {
          this.stationList = res.data.data;
        }
      });
    },
    getOrgList () {
      let _data = {
        token: '1'
      };
      this.$axios.get('/api/umc/orignization/findOrgTree', _data).then(res => {
        if (res.data.code === 200) {
          this.departmentDataSource = res.data.data;
        }
      });
    },
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
      this.$CGET('/score/findTotalScoreTable', _data, res => {
        if (res.code === 200) {
          let result = res.data;
          let level = ['anum', 'bnum', 'cnum', 'dnum', 'fnum', 'snum'];
          let obj = {
            titles: [],
            value: [],
            legendData: [],
            finish: result.scoreNum,
            noFinish: result.noScoreNum
          };
          level.forEach(item => {
            obj.value.push(result[item]);
            let str = item.substr(0, 1);
            obj.titles.push(str.toUpperCase()+'级别');
            obj.legendData.push({
              name: str.toUpperCase()+'级别',
              value: result[item]
            })
          });
          this.initPfmBarCharts(obj);
          this.initPfmPieCharts(obj);
          // if (obj.finish || obj.noFinish) {
          //   this.chartShow = true;
          //   this.$nextTick(() =>{
          //     this.initPfmBarCharts(obj);
          //     this.initPfmPieCharts(obj);
          //   });
          // } else {
          //   this.chartShow = false;
          // }
        }
        this.loading = false;
      }, err => {});
    },
    initPfmBarCharts (data) {
      let chart = echarts.init(document.getElementById('pieCharts'));
      let option = {
        title: {
          text: '绩效总表柱状图',
          x: 'center'
        },
        tooltip : {
        trigger: 'axis',
          axisPointer : {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: data.titles,
        },
        yAxis: {
          type: 'value'
        },
        barWidth: '40px',
        series: [{
          data: data.value,
          type: 'bar'
        }]
      };
      chart.setOption(option);
    },
    initPfmPieCharts (data) {
      let chart = echarts.init(document.getElementById('barCharts'));
      let option = {
        title : {
          text: `已打分人数${data.finish},未打分人数${data.noFinish}`,
          x: 'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: data.titles
        },
        series: [
        {
          name: '总数',
          type: 'pie',
          // radius: ['50%', '70%'],
          center: ['50%', '60%'],
          data: data.legendData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
      chart.setOption(option);
    },
    handleSortBtnClick () {
      this.isSort = !this.isSort;
    },
    handleSearchBtnClick () {
      this.getPfmTableList();
    },
    handleCurrentPageChange (currentPage) {
      this.search.pageNo = currentPage;
      this.getPfmTableList();
    }
  }
}
</script>
<style lang="scss">
.st-view {
  height: 100%;
  width: 100%;
}
.st-view__header {}
.st-view__main {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: -moz-calc(100% - 44px);
  height: -webkit-calc(100% - 44px);
  height: calc(100% - 44px);
  width: 100%;
}
.st-view__main>div {
  position: relative;
  height: 100%;
  width: 50%;
}
.st-view__main .data-none {
  height: 100%;
  width: 100%;
  // border: 1px solid #dcdfe6;
  text-align: center;
  font-size: 14px;
  color: #909399;
  padding-top: 100px;
}
</style>
