<template>
  <el-container class="emc-view" v-loading="loading">
    <el-header class="emc__header" height="44px">
      <el-row :gutter="24" type="flex" justify="space-between">
        <div class="header-ratio">
          <el-radio-group v-model="evalActive" size="small" @change="handleRatioChange">
            <el-radio-button label="未考评"></el-radio-button>
            <el-radio-button label="已考评"></el-radio-button>
            <el-radio-button label="全部"></el-radio-button>
          </el-radio-group>
          <el-select v-model="search.etId" size="small" clearable
                    filterable placeholder="请选择类型"
                    @change="handleETChange">
            <el-option v-for="(item, index) in etList" :key="index" :label="item.etName" :value="item.etId"></el-option>
          </el-select>
          <el-select v-model="search.evId" size="small" clearable
                    filterable placeholder="请选择考评"
                    @change="handleEVChange">
            <el-option v-for="(item, index) in evList" :key="index" :label="item.evName" :value="item.evId"></el-option>
          </el-select>
          <el-select v-model="search.eiId" size="small" clearable
                    filterable placeholder="请选择用户"
                    @change="handleEIChange">
            <el-option v-for="(item, index) in eiList" :key="index" :label="item.eiName" :value="item.eiId"></el-option>
          </el-select>
          <el-select v-model="search.rsId" size="small" clearable
                    filterable placeholder="请选择关系"
                    @change="handleRSChange">
            <el-option v-for="(item, index) in rsList" :key="index" :label="item.rsName" :value="item.rsId"></el-option>
          </el-select>
          <el-select v-model="search.efId" size="small" clearable
                    filterable placeholder="请选择考核表"
                    @change="handleEFChange">
            <el-option v-for="(item, index) in efList" :key="index" :label="item.efName" :value="item.efId"></el-option>
          </el-select>
          <el-button size="small" type="primary" @click="handleSearchBtnClick">搜索</el-button>
          <el-button size="small" type="primary" :loading="inforLoading" @click="handleInformBtnClick">一键通知</el-button>
          <el-button size="small" type="primary" @click="handleExportBtnClick">导出</el-button>
        </div>
      </el-row>
    </el-header>
    <el-main class="emc-main">
      <el-table :data="tableList" style="width: 100%;" border>
        <el-table-column label="被评分项" prop="eiName"></el-table-column>
        <el-table-column label="被评分人工号" prop="eiCode"></el-table-column>
        <el-table-column label="考评人" prop="evPeopleName"></el-table-column>
        <el-table-column label="考评人岗位" prop="evPositionName"></el-table-column>
        <el-table-column label="评分开始日期" prop="evStartTime" width=200></el-table-column>
        <el-table-column label="考评名称" prop="evName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="props">
            <el-button size="small" type="primary" @click="handleItemInformBtnClick(props.row)">通知</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="emc-footer" height="34px">
      <el-pagination  background
                      :page-size="search.pageSize"
                      :current-page="search.pageNum"
                      layout="total, prev, pager, next"
                      :total="totalNumber"
                      @current-change="handlePageChangeClick">
      </el-pagination>
    </el-footer>
    <layer :text="alert" v-show="alert.show"></layer>
  </el-container>
</template>
<script>
import Layer from '@/view/common/layer';
import token from '@/assets/js/token';
const EVAL_TYPE = {
  unEval: '未考评',
  evaled: '已考评',
  all: '全部'
};
const EVAL_CODE = {
  unEval: 0,
  evaled: 1,
  all: ''
};
export default {
  name: 'EmcView',
  components: {
    Layer
  },
  data() {
    return {
      alert: {
        text: '',
        type: '',
        show: false
      },
      EVAL_TYPE, // 考评类型
      EVAL_CODE, // 考评类型code
      loading: false,
      evalActive: '未考评', // 单选框
      tableList: [], // 表格数据
      etList: [], // 考评类型列表
      evList: [], // 考评列表
      eiList: [], // 人员列表
      rsList: [], // 关系列表
      efList: [], // 考核表列表
      search: {
        etId: '', // 考评类型
        evId: '', // 考评
        eiId: '', // 人员
        rsId: '', // 关系
        efId: '', // 考核表
        pageNum: 1, // 分页
        pageSize: 10, // 页数
      },
      totalNumber: 0, // 数据总量
      inforLoading: false
    }
  },
  mounted () {
    Promise.all([this.getEvaluateList(), this.getEtList()]).then(res => {
      this.getTableList();
    });
    this.getAllData();
  },
  methods: {
    getAllData () {
      this.getEiList();
      this.getRsList();
      this.getEfList();
    },
    /**
     * @description: 获取考评ev
     */
    getEvaluateList () {
      return new Promise((resolve, reject) => {
        // /evaluate/findAllEvaluate
        this.$CPOST('/evaluate/findMyEvaluate', {}, res => {
          if (res.code === 200) {
            this.evList = res.data.list;
            this.search.evId = this.evList[0].evId;
          }
          resolve(res);
        }, err => {
          reject(err);
        })
      });
    },
    /**
     * @description: 获取考评类型et
     */
    getEtList () {
      return new Promise((resolve, reject) => {
        this.$CPOST('/evaluateType/findAllEvaluateType', {}, res => {
          if (res.code === 200) {
            this.etList = res.data.list;
            this.search.etId = this.etList[0].etId;
          }
          resolve(res)
        }, err => {
          reject(err);
        });
      });
    },
    /**
     * @description: 获取人员列表
     */
    getEiList () {
      let _data = {};
      this.$CGET('/evaluateItem/findAll', _data, res => {
        if (res.code === 200) {
          this.eiList = res.data;
        }
      }, err => {});
    },
    /**
     * @description: 获取关系表列表
     */
    getRsList () {
      let _data = {};
      this.$CPOST('/relation/findRelationship', _data, res => {
        if (res.code === 200) {
          this.rsList = res.data.list;
        }
      }, err => {});
    },
    getEfList () {
      this.$CGET('/evaluateForm/findEvaluateFormVo', {}, res => {
        if (res.code === 200) {
          this.efList = res.data;
        }
      }, err => {});
    },
    getTableList () {
      this.loading = true;
      let active = '';
      for (const key in this.EVAL_TYPE) {
        if (this.evalActive === this.EVAL_TYPE[key]) {
          active = key;
        }
      }
      active = this.EVAL_CODE[active];
      let _data = {
        gradeStatus: active
      };
      // 有值就添加
      for (const key in this.search) {
        if (Array.isArray(this.search[key])) {
          this.search[key].length ? _data[key] = this.search[key] : '';
        } else {
          this.search[key] ? _data[key] = this.search[key] : '';
        }
      }
      this.$CPOST('/score/findScoreList', _data, res => {
        if (res.code === 200) {
          this.tableList = res.data.list;
          this.totalNumber = res.data.total;
        }
        this.loading = false;
      }, err => {
        this.loading = false;
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
    /**
     * @description: 考评类型改变
     */
    handleETChange () {
      this.getTableList();
    },
    /**
     * @description: 单选事件
     */
    handleRatioChange (val) {
      this.search.pageNum = 1;
      this.getTableList();
    },
    /**
     * @description: 考评批次改变
     */
    handleEVChange () {},
    /**
     * @description: 导出点击事件
     */
    /**
     * @description: 人员改变事件
     */
    handleEIChange () {},
    /**
     * @description: 关系表改变事件
     */
    handleRSChange () {},
    /**
     * @description: 考核表改变事件
     */
    handleEFChange () {},
    /**
     * @description: 搜索事件
     */
    handleSearchBtnClick () {
      this.search.pageNum = 1;
      this.getTableList();
    },
    /**
     * @description: 一件通知
     */
    handleInformBtnClick () {
      if (!this.search.evId) {
        this.alert = {
          text: '请先选择考评',
          type: 'error',
          show: true
        }
        return false;
      }
      this.inforLoading = true;
      let _data = {
        evId: this.search.evId
      };
      this.$CPOST('/send/sendEmailByEvID', _data, res => {
        this.inforLoading = false;
        this.alert = {
          text: res.msg,
          type: res.code === 200 ? 'success' : 'error',
          show: true
        }
      }, err => {
        this.inforLoading = false;
      });
    },
    handleExportBtnClick () {
      let active = '';
      for (const key in this.EVAL_TYPE) {
        if (this.evalActive === this.EVAL_TYPE[key]) {
          active = key;
        }
      }
      active = this.EVAL_CODE[active];
      let _data = {
        gradeStatus: active,
        token
      };
      // 有值就添加
      for (const key in this.search) {
        if (Array.isArray(this.search[key])) {
          this.search[key].length ? _data[key] = this.search[key] : '';
        } else {
          this.search[key] ? _data[key] = this.search[key] : '';
        }
      }
      let arr = ['pageNum', 'pageSize'];
      arr.forEach(t => {
        if (_data.hasOwnProperty(t)) {
          Reflect.deleteProperty(_data, t);
        }
      });
      this.exportTableData('/api/emc/file/exportMyScoreList', _data, 'post');
    },
    /**
     * @description: 点击表格通知按钮
     */
    handleItemInformBtnClick (item) {
      let _data = {
        evName: item.evName,
        evPeopleId: item.evPeopleId,
        eiName: item.eiName
      };
      this.$CPOST('/send/sendEmail', _data, res => {
        this.alert = {
          text: res.msg,
          type: res.code === 200 ? 'success' : 'error',
          show: true
        };
      }, err => {});
    },
    /**
     * @description: 分页事件
     */
    handlePageChangeClick (currentPage) {
      this.search.pageNum = currentPage;
      this.getTableList();
    }
  }
};
</script>
<style lang="scss">
.emc-view {
  height: 100%;
  width: 100%;
}
.emc-main {
  height: -moz-calc(100% - 78px);
  height: -webkit-calc(100% - 78px);
  height: calc(100% - 78px);
}
.header-ratio {
min-width: 1100px;
  .el-select {
    width: 12%;
  }
}
</style>
