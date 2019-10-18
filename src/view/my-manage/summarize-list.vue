<template>
  <el-container class="sum-list" v-loading="loading">
    <el-header class="sum-list__header" height="44px">
      <el-row :gutter="24">
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
          <el-select v-model="search.positionId" size="small" clearable filterable placeholder="请选择职位">
            <el-option v-for="item in stationList" :key="item.positionId" :label="item.positionName" :value="item.positionId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="false">
          <el-select v-model="search.rankId" size="small" clearable filterable placeholder="请选择职级">
            <el-option v-for="(item, index) in rankList" :key="index"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="permission.isAdmin">
          <el-select v-model="search.userId" size="small" clearable filterable placeholder="请选择用户">
            <el-option v-for="(item, index) in userList" :key="index" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="permission.isAuditor">
          <el-select v-model="search.userId" size="small" clearable filterable placeholder="请选择用户">
            <el-option v-for="(item, index) in evPeopleList" :key="index" :label="item.eiName" :value="item.eiId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="search.evId" size="small" clearable filterable placeholder="请选择考评">
            <el-option v-for="(item, index) in evList" :key="index" :label="item.evName" :value="item.evId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="primary" @click="handleSearchBtnClick">搜索</el-button>
        </el-col>
        <el-col :span="4">
          <el-button size="small" type="primary" @click="handleExportClick">导出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="sum-list__main">
      <el-table :data="summaryList" style="width:100%;" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="总结：">
                <div v-html="props.row.suContent"></div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="userName" min-width="60px"></el-table-column>
        <el-table-column label="考评名称" prop="evName" min-width="60px"></el-table-column>
        <el-table-column label="职级" prop="rankName"></el-table-column>
        <el-table-column label="职位" prop="positionName"></el-table-column>
        <!-- <el-table-column label="部门" prop="orgName"></el-table-column> -->
        <el-table-column label="下属人数" prop="underSize"></el-table-column>
        <el-table-column label="入职日期" prop="entry"></el-table-column>
      </el-table>
    </el-main>
    <el-footer height="34px">
      <el-pagination background
                    layout="total, prev, pager, next"
                    :page-size="15"
                    :current-page="search.pageNum"
                    :total="totalNumber"
                    @current-change="handlePageChangeClick">
      </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
// '1', '7db73b735cd64ea9ac9656f9d9420c71', 'b80c3b03406f4556b0a95eb56778790b'
export default {
  name: 'SummarizeList',
  data () {
    return {
      loading: false,
      orgList: [], // 部门列表
      stationList: [], // 职位列表
      userList: [], // 用户列表
      summaryList: [], // 数据
      evList: [], // 考评名称列表
      evPeopleList: [], // 考评项列表
      totalNumber: 0, // 总数
      props: {
        value: 'orgId',
        label: 'orgName',
        children: 'children'
      },
      search: {
        pageNum: 1,
        pageSize: 10,
        orgId: [],
        rankId: '',
        positionId: '',
        userId: '',
        evPersonId: '',
        evId: ''
      }, // 搜索参数
      permission: {
        isAdmin: false,
        isAuditor: false,
        isUser: false
      }
    };
  },
  mounted () {
    this.getAllData();
  },
  methods: {
    getAllData () {
      this.getEvNameList();
      this.getOrgList();
      this.getStationList();
      this.getUserInfo();
    },
    /**
     * @description: 获取用户详情
     */
    getUserInfo () {
      this.$UPOST('/api/umc/user/findUserByUserId', {
          userId: this.$zcId,
          menuId: this.$menuId
        }, res => {
          if (res.code === 200) {
            let result = res.data;
            if (result.roles && Array.isArray(result.roles) && result.roles.length) {
              let name = result.roles[0].roleName;
              if (name) {
                if (name === '管理员') {
                  this.permission.isAdmin = true;
                  this.getUserList();
                } else if (~name.indexOf('审核') || ~name.indexOf('考核')) {
                  this.permission.isAuditor = true;
                  this.search.evPersonId = result.userId ? result.userId : '';
                  this.getEvPeopleList();
                } else {
                  this.permission.isUser = true;
                  this.search.userId = result.userId ? result.userId : '';
                }
              }
              this.getSummaryList();
            }
          }
      })
    },
    /**
     * @description: 获取考评名称
     */
    getEvNameList () {
      let _data = {};
      this.$CPOST('/evaluate/findAboutMeEvaluate', _data, res => {
        if (res.code === 200) {
          const list = res.data;
          if (list && Array.isArray(list) && list.length) {
            this.evList = res.data;
            // this.search.evId = res.data[0].evId;
          } else {
            this.evList = [];
          }
        }
      })
    },
    /**
     * @description: 获取考核项
     */
    getEvPeopleList () {
      let _data = {
        evPeopleId: this.$zcId
      };
      this.$CGET('/evaluateItem/findEiIdByEvPeopleId', _data, res => {
        if (res.code === 200) {
          this.evPeopleList = res.data;
        }
      });
    },
    /**
     * @description: 获取总结列表
     */
    getSummaryList () {
      const loading = this.$loading(this.$store.state.loading);
      // this.loading = true;
      let _data = Object.assign({}, this.search);
      _data.orgId = this.search.orgId.length ? this.search.orgId[this.search.orgId.length - 1] : '';
      this.$CPOST('/summary/findSummaryData', _data, res => {
        loading.close();
        if (res.code === 200) {
          let result = res.data.list;
          if (result && Array.isArray(result) && result.length) {
            this.summaryList = res.data.list;
            this.totalNumber = res.data.total;
          } else {
            this.summaryList = [];
            this.totalNumber = 0;
          }
        }
        this.loading = false;
      }, err => {});
    },
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
    getStationList () {
      this.$axios.get('/api/umc/position/findPositionAll', {}).then(res => {
        if (res.data.code === 200) {
          this.stationList = res.data.data;
        }
      });
    },
    getUserList () {
      let _data = {};
      this.$axios.get('/api/umc/user/findUserAll', _data).then(res => {
        if (res.data.code === 200) {
          this.userList = res.data.data.list;
        }
      });
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
    handleSearchBtnClick () {
      this.search.pageNum = 1;
      this.getSummaryList();
    },
    handleExportClick () {
      let _data = {};
      for (const key in this.search) {
        if (Array.isArray(this.search[key])) {
          this.search[key].length ? (key === 'orgId' ? _data[key] = this.search[key][this.search[key].length - 1] : _data[key] = this.search[key]) : '';
        } else {
          this.search[key] ? _data[key] = this.search[key] : '';
        }
      }
      this.exportTableData('/api/emc/file/exportSummaryList', _data, 'get');
    },
    handlePageChangeClick (currentPage) {
      this.search.pageNum = currentPage;
      this.getSummaryList();
    }
  }
}
</script>
