<template>
  <el-container class="rating-list">
    <el-header class="rating-list__header">
      <div class="search-item">
        <el-select v-model="name" size="small" filterable clearable>
          <el-option v-for="(item, index) in nameList"
                    :key="index"
                    :label="item.levelName"
                    :value="item.levelId">
          </el-option>
        </el-select>
      </div>
      <div class="search-item">
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchBtnClick"></el-button>
        <el-button size="small" type="primary" @click="handleAddLevelBtnClick">新增</el-button>
      </div>
    </el-header>
    <el-main class="rating-list__main">
      <el-table :data="dataSource" height="100%" style="width:100%;" border :span-method="objectSpanMethodFc">
        <el-table-column label="评级名称" prop="levelName"></el-table-column>
        <el-table-column label="评级" prop="subLevelName"></el-table-column>
        <el-table-column label="占比" prop="percent"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div title="编辑" class="iconfont icon-bianji zc-btn" @click="handleEditTableItem(scope)"></div>
            <div title="删除" class="iconfont icon-shanchu zc-btn" @click="handleDeleteTableItem(scope)"></div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="rating-list__footer" height="44px">
      <el-pagination background
        layout="prev, pager, next"
        :total="totalNum"
        :page-size="pageSize"
        :current-page.sync="pageNum"
        @current-change="handleCurrentPageChange">
      </el-pagination>
    </el-footer>
    <el-dialog title="评级"
                width="800px"
                :visible.sync="levelModalVisible"
                :append-to-body="true">
      <el-form ref="form" class="rating-form" label-width="100px" :model="form" :rules="rule">
        <el-form-item prop="levelName" label="评级名称">
          <el-input size="small" v-model="form['levelName']" placeholder="评级名称"></el-input>
        </el-form-item>
        <el-form-item prop="openStatus" label="评级状态">
          <el-select size="small" v-model="form['openStatus']">
            <el-option :label="'公开'" :value="0"></el-option>
            <el-option :label="'私有'" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="评级备注">
          <el-input size="small" type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleAddChildren">新增子集</el-button>
        </el-form-item>
        <el-form-item label="评级详情" :error="item.error" v-for="(item, index) in form.levelListString" :key="index">
          <el-row :gutter="12">
            <el-col :span="6">
              <span v-show="index === 0">名称</span>
              <el-input size="small" v-model="item.levelName" placeholder="百分比名称"></el-input>
            </el-col>
            <el-col :span="4">
              <span v-show="index === 0">所占百分比</span>
              <el-input size="small" v-model="item.percent" placeholder="所占百分比%" @input="handlePercentInput(item)"></el-input>
            </el-col>
            <el-col :span="6">
              <span v-show="index === 0">备注</span>
              <el-input size="small" v-model="item.remark" placeholder="备注"></el-input>
            </el-col>
            <el-col :span="5">
              <span v-show="index === 0">排序</span>
              <el-input-number size="small" v-model="item.orderNum" :min="1" placeholder="排序"></el-input-number>
            </el-col>
            <el-col :span="2">
              <i class="el-icon-circle-close" style="cursor: pointer; color: red;" @click="handleDeleteInfoItem(item)"></i>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleSubmitFormBtnClick">提交</el-button>
          <el-button size="small" @click="handleCancelBtnClick">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      pageNum: 1,
      pageSize: 15,
      totalNum: 0,
      nameList: [],
      name: '',
      dataSource: [],
      levelModalVisible: false,
      concatObj: {},
      isEdit: false,
      tmpList: [],
      selectLevel: {},
      form: {
        levelName: '',
        openStatus: 1,
        remark: '',
        levelListString: []
      },
      rule: {
        levelName: [
          { required: true, message: '请输入评级名称', trigger: 'blur' }
        ],
        levelListString: [
          { required: true, message: '请输入百分比', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getSearchList();
    this.getDataSource();
  },
  methods: {
    getSearchList () {
      this.$CPOST('/level/findMyLevel', {}, (res) => {
        this.nameList = res.data;
      });
    },
    getDataSource () {
      const _data = {
        levelId: this.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      this.$CPOST('/level/findMyLevelPage', _data, (res) => {
        const result = res.data.list;
        if (result && Array.isArray(result) && result.length) {
          this.tmpList = result;
          const tileList = this.tileListFc(result);
          this.dataSource = tileList;
          this.totalNum = res.data.total;
        } else {
          this.totalNum = 0;
          this.dataSource = [];
        }
      });
    },
    tileListFc (list) {
      const arr = [];
      list.forEach(item => {
        if (item.levelList && Array.isArray(item.levelList) && item.levelList.length) {
          item.levelList.forEach(sub => {
            arr.push({
              levelName: item.levelName,
              levelId: item.levelId,
              openStatus: item.openStatus,
              remark: item.remark,
              subLevelName: sub.levelName,
              subLevelId: sub.levelId,
              percent: sub.percent * 100 + '%',
              subRemark: sub.remark
            });
          });
        } else {
          arr.push({
            levelName: item.levelName,
            levelId: item.levelId,
            openStatus: item.openStatus,
            remark: item.remark,
            subLevelName: '',
            subLevelId: '',
            percent: '',
            subRemark: ''
          });
        }
      });
      this.concatObj = this.mergeTableFc(arr);
      return arr;
    },
    mergeTableFc (list) {
      const row = [];
      let rowIndex = 0;
      list.forEach((item, index) => {
        if (index === 0) {
          row[rowIndex] = 1;
        } else {
          if (item.levelId === list[index - 1].levelId) {
            row[rowIndex] += 1;
            row[index] = 0;
          } else {
            rowIndex = index;
            row[rowIndex] = 1;
          }
        }
      });
      return { row };
    },
    objectSpanMethodFc ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 3) {
        const _row = this.concatObj['row'][rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    submitData () {
      let url = '/level/addLevel';
      if (this.isEdit) {
        url = '/level/updateLevel';
      }
      const mapString = this.form.levelListString.map(t => {
        return {
          levelName: t.levelName,
          percent: Number(t.percent.replace('%', '')),
          remark: t.remark,
          orderNum: t.orderNum
        }
      });
      const _data = Object.assign({}, this.form, {
        levelListString: JSON.stringify(mapString)
      });
      if (this.isEdit) {
        _data.levelId = this.selectLevel.levelId;
      }
      this.$CPOST(url, _data, (res) => {
        if (res.code === 200) {
          this.getDataSource();
          this.levelModalVisible = false;
        }
        this.$message({
          message: res.msg,
          type: res.code === 200 ? 'success' : 'error'
        });
      });
    },
    checkItem () {
      return new Promise((resolve, reject) => {
        if (this.form.levelListString.length) {
          this.form.levelListString.forEach(item => {
            if (!item.levelName || !item.percent || !item.orderNum) {
              item.error = '名称,占比,排序是必填的';
            } else {
              item.error = '';
            }
          });
          let isError = [];
          const sum = this.form.levelListString.reduce((prv, cur) => {
            if (cur.error) {
              isError.push(true);
            }
            return prv + Number(cur.percent.replace('%', ''));
          }, 0);
          if (!isError.length && sum === 100) {
            resolve();
          } else {
            let errorMsg = '';
            if (isError.length) {
              errorMsg = '名称,占比,排序是必填的';
            }
            if (sum !== 100) {
              errorMsg = '详情占比总和必须是100%'
            }
            reject(errorMsg);
          }
        } else {
          reject('请添加评级详情');
        }
      });
    },
    handleSearchBtnClick () {
      this.getDataSource();
    },
    handleAddLevelBtnClick () {
      for (const key in this.form) {
        if (typeof this.form[key] === 'number') {
          this.form[key] = 1;
        } else if (Array.isArray(this.form[key])) {
          this.form[key] = [];
        } else {
          this.form[key] = '';
        }
      }
      this.isEdit = false;
      this.levelModalVisible = true;
    },
    handleEditTableItem ({row}) {
      this.selectLevel = row;
      const find = this.tmpList.find(t => t.levelId === row.levelId);
      if (find) {
        for (const key in find) {
          if (this.form.hasOwnProperty(key)) {
            this.form[key] = find[key];
          }
        }
        const mapList = find.levelList.map(t => {
          return {
            levelName: t.levelName,
            percent: t.percent * 100 + '%',
            remark: t.remark,
            orderNum: t.orderNum ? t.orderNum : 1,
            subLevelId: Math.random() * 100 + Date(new Date()),
            error: ''
          };
        });
        this.form.levelListString = mapList;
      }
      this.isEdit = true;
      this.levelModalVisible = true;
    },
    handleDeleteTableItem ({row}) {
      this.$alert('确定要删除吗？', '', {
        confirmButtonText: '确定',
        callback: action => {
          this.$CPOST('/level/delLevel', { levelId: row.levelId }, res => {
            if (res.code === 200) {
              this.getDataSource();
            }
          });
        }
		  })
    },
    handleSubmitFormBtnClick () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.checkItem().then(res => {
            this.submitData();
          }).catch(err => {
            this.$message({
              message: err,
              type: 'error'
            });
          });
        }
      });
    },
    handleCancelBtnClick () {
      this.levelModalVisible = false;
    },
    handleCurrentPageChange (val) {
      this.pageNum = val;
      this.getDataSource();
    },
    handleAddChildren () {
      this.form.levelListString.push({
        levelName: '',
        percent: '0%',
        remark: '',
        orderNum: this.form.levelListString.length ? this.form.levelListString[this.form.levelListString.length-1].orderNum + 1 : 1,
        subLevelId: Math.random() * 100 + Date.parse(new Date()),
        error: ''
      });
    },
    handlePercentInput (item) {
      let val = item.percent;
      if (~val.indexOf('%') && val.indexOf === val.length) {} else {
        let str = val.replace('%', '');
        str += '%';
        val = str;
      }
      this.form.levelListString.forEach(t => {
        if (item.subLevelId === t.subLevelId) {
          t.percent = val;
        }
      });
    },
    handleDeleteInfoItem (item) {
      this.$alert('确定要删除吗？', '', {
        confirmButtonText: '确定',
        callback: action => {
          const index = this.form.levelListString.findIndex(t => t.subLevelId === item.subLevelId);
          this.form.levelListString.splice(index, 1);
        }
		  })
    }
  }
}
</script>
<style scoped>
.rating-list {
  height: 100%;
  width: 100%;
}
.rating-list__header {
  display: flex;
  width: 100%;
  padding: 0px;
}
.search-item {
  padding-right: 5px;
}
.rating-list__main {
  height: calc(100% - 104px);
  width: 100%;
  padding: 0px;
}
.rating-list__footer {
  width: 100%;
  padding: 10px 0px 0px 0px;
}
.rating-form {}
.el-form-item {
  width: 100%;
}
</style>
