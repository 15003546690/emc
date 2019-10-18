<template>
  <el-container class="my-sum">
    <el-header class="my-sum__header" height="100px">
      <el-row class="header-row" type="flex" :gutter="24">
        <div>
          <label>姓名:</label> <span>{{info.userName}}</span>
        </div>
        <div>
          <label>部门/职位:</label> <span>{{info.orgname}}</span>
        </div>
        <div>
          <label>入职日期:</label> <span>{{info.enterDate}}</span>
        </div>
        <div>
          <label>职级:</label> <span>{{info.positionName}}</span>
        </div>
      </el-row>
      <el-row :gutter="24">
        <div class="header-inner">
          <label>选择考评项:</label>
          <span class="span-select">
            <el-select class="my-sum-input" size="small" v-model="info.evId" @change="handleEvidChange">
              <el-option v-for="(item, index) in evList" :key="index" :label="item.evName" :value="item.evId"></el-option>
            </el-select>
            <el-button size="small" type="primary" @click="handleSearchClick">搜索</el-button>
          </span>
        </div>
      </el-row>
      <el-row :gutter="24">
        <div class="header-inner">
          <label>下属人数:</label>
          <span>
            <el-input-number size="mini" v-model="info.underUserCount" label="下属人数"></el-input-number>
          </span>
        </div>
      </el-row>
    </el-header>
    <div class="my-sum_bar" style="padding: 20px 0 10px 10px;color: red;">
      请务必按照考核指标内容写总结，以便打分人参考。
    </div>
    <el-main class="my-sum__main">
      <quill-editor v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
            @blur="handleEditorBlur($event)"
            @focus="handleEditorFocus($event)"
            @change="handleEditorChange($event)">
      </quill-editor>
      <div class="zc-len" v-show='textLen<500'>您还可以输入<span style='color: #66b1ff'>{{500-textLen}}</span>个字</div>
      <div class="zc-len" v-show='textLen>500'>您已超出<span style="color: red">{{beyond}}</span>个字</div>
    </el-main>
    <el-footer class="my-sum-footer" height="34px">
      <el-button size="small" type="primary" :disabled="!info.evId " @click="handleSaveDraftBtnClick">保存为草稿</el-button>
      <el-button size="small" type="primary" :disabled="!info.evId" @click="handleSaveLeaderBtnClick">提交给领导</el-button>
    </el-footer>
    <layer :text="alert" v-show="alert.show"></layer>
  </el-container>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import Layer from '@/view/common/layer';
import { clearInterval } from 'timers';
export default {
  name: 'MySummarize',
  components: {
    quillEditor,
    Layer
  },
  data () {
    return {
      textLen:'',
      beyond:'',
      alert: {
        text: '',
        type: '',
        show: false
      },
      evList: [],
      info: {
        userName: '',
        enterDate: '',
        orgname: '',
        positionName: '',
        underUserCount: 0,
        evId: ''
      },
      content: '',
      editorOption: {},
      timer: null
    };
  },
  mounted () {
    this.getUserInfo();
    this.getEvaluateList();
    this.timer = setInterval(()=>{
      this.handleSaveDraftBtnClick();
    },300000);
  },
  beforeDestroy () {
    if (this.timer !== null) {
      clearInterval(self.timer);
      this.timer = null;
    }
  },
  methods: {
    getUserInfo () {
      this.$UPOST('/api/umc/user/findUserByUserId',{
          userId: this.$zcId,
          menuId: this.$menuId
        }, res => {
          let result = res.data;
          this.info.userName = result.userName;
          this.info.enterDate = result.entry;
          if (result.organizationPositions && Array.isArray(result.organizationPositions) && result.organizationPositions.length) {
            this.info.orgname = result.organizationPositions[0].orgname;
            this.info.positionName = result.organizationPositions[0].positionName;
          }
      })
    },
    getMyUnderUser (orgId) {
      let _data = {
        token: this.$zcId,
        orgId
      };
      this.$UPOST('/api/umc/user/findMyUnderUser', _data, res => {
        if (res.code === 200) {
          this.info.underUserCount = res.data.length;
        }
      }, err => {});
    },
    getEvaluateList () {
      // /evaluate/findAllEvaluate
      this.$CPOST('/evaluate/findMyOnTimeEvaluate', {}, res => {
        if (res.code === 200) {
          this.evList = res.data;
          this.info.evId = this.evList[0].evId;
          this.getEditorContent();
        }
      }, err => {})
    },
    getEditorContent () {
      let orgId = this.getCookie('orgId');
      let _data = {
        evId: this.info.evId,
        userId: this.$zcId ? this.$zcId : ''
      };
      this.$CPOST('/summary/findMySummary', _data, res => {
        if (res.code === 200) {
          if (res.data) {
            this.info.underUserCount = res.data.var2;
            this.content = res.data.suContent;
          }
        }
      }, err => {});
    },
    getCookie (name) {
      let arr,reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
      if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },
    /**
     * @description: 数值框改变事件
     */
    handleInputChange () {},
    handleEditorBlur () {},
    handleEditorFocus () {},
    handleEditorChange (e) {
      this.textLen = e.text.length - 1;
      this.beyond = this.textLen - 500;
      if (this.textLen > 500) {
        this.info.evId = '';
      } else {
        this.info.evId = this.evList[0].evId;
      }
    },
    /**
     * @description: 保存为草稿
     */
    handleSaveDraftBtnClick () {
      if (!this.content) {
        this.alert = {
          text: '请输入总结',
          type: 'error',
          show: true
        };
        return false;
      }
      let _data = {
        userId: this.$zcId,
        evId: this.info.evId,
        suContent: this.content,
        var2: this.info.underUserCount
      };
      this.$CPOST('/summary/addSummary', _data, res => {
        this.alert = {
          text: res.msg,
          type: res.code === 200 ? 'success' : 'error',
          show: true
        }
      }, err => {});
    },
    /**
     * @description: 提交给领导
     */
    handleSaveLeaderBtnClick () {
      if (!this.content) {
        this.alert = {
          text: '请输入总结',
          type: 'error',
          show: true
        };
        return false;
      }
      let _data = {
        userId: this.$zcId,
        evId: this.info.evId,
        suContent: this.content,
        var2: this.info.underUserCount
      };
      this.$CPOST('/summary/submitSummary', _data, res => {
        this.alert = {
          text: res.msg,
          type: res.code === 200 ? 'success' : 'error',
          show: true
        }
      }, err => {});
    },
    /**
     * @description: 考评值改变时
     */
    handleEvidChange () {
      this.alert = {
        show: true,
        text: '切换考评,请注意保存总结内容',
        type: 'error'
      };
    },
    /**
     * @description: 搜索
     */
    handleSearchClick () {
      this.getEditorContent();
    }
  }
}
</script>
<style>
.my-sum {
  height: 100%;
  width: 100%;
}
.my-sum__header .el-col {
  vertical-align: middle;
  background: rgb(236, 236, 236);
}
.my-sum__header>.el-row {
  margin-bottom: 10px;
}
.my-sum__main {
  height: -moz-calc(100% - 78px);
  height: -webkit-calc(100% - 78px);
  height: calc(100% - 78px);
}
.header-row>div {
  margin-right: 25px;
}
.header-row .el-col>span {
  display: block;
  height: 44px;
  line-height: 44px;
  padding-left: 5px;
}
.span-select {
  flex-basis: 70%;
}
.header-row .el-col {
  display: flex;
  align-items: center;
}
.quill-editor {
  height: -moz-calc(100% - 66px);
  height: -webkit-calc(100% - 66px);
  height: calc(100% - 66px);
}
.header-inner {
  display: flex;
}
.header-inner>label {
  display: block;
  width: 115px;
}
.zc-len{
  padding-right: 20px;
  padding-top: 30px;
  text-align: right;
  font-size: 14px;
}
.zc-len span{
  font-size: 18px;
  font-weight: bold;
}
</style>
