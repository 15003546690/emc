<template>
  <div class="c-header">
  <!--  - Beta -->
    <div class="header-logo"><a href="./">绩效考评系统<span>v1.4.3</span></a></div>
    <div class="header-tool">
      <span class="tool-item" :title="superName+':'+name"><img :src="imgurl"/></span>
      <div class="icon-item">
         <span class="tool-item" @click='email'>
        <el-badge :value="emai" class="item" :max="99" v-show='emai!=0'>
          <i class="el-icon-message"></i>
        </el-badge>
        <i class="el-icon-message" v-show='emai==0'></i>
        </span>
        <span class="tool-item">
          <i class="el-icon-question" @click='help()'></i>
        </span>
        <span @click='out()'>
          登出
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheAside',
  created () {
    if (this.$Token != null) {
      this.currentData();
    }
  },
  data () {
    return {
      name: '',
      superName: '',
      emai: '',
      imgurl: ''
    };
  },
  methods: {
    help () {
      this.$router.push({path: '/index/help'});
    },
    out () {
      this.$DelCookie('id');
      this.$DelCookie('zctoken');
      this.$DelCookie('token');
      this.$DelCookie('menuId');
      // location.reload();
      let host = window.location.hostname;
      if (host == '192.168.112.210') { // 测试
        window.location.href = 'http://192.168.112.210:9007/#/login';
      } else if (host == 'www.visionvepal.com') { // 正式内网
        window.location.href = 'http://www.visionvepal.com';
      } else if (host == '58.30.9.142') { // 正式外网
        window.location.href = 'https://58.30.9.142:48082/#/login';
      } else {
        window.location.href = 'http://192.168.112.210:9007/#/login';
      }
    },
    currentData () {
      this.$UPOST('/api/umc/user/findUserByUserId', {
        userId: this.$zcId,
        menuId: this.$menuId
      }, (res) => {
        this.name = res.data.userName;
        this.superName = res.data.roles[0].var1;
        this.imgurl = res.data.pictureBase64;
      });
      this.$CPOST('/score/findNoScoreNum', {

      }, (res) => {
        this.emai = res.data;
      });
    },
    email () {
      this.$router.push({path: '/index/myEmcList', 'query': {btnGroup: 1}});
    }
  }
};
</script>
<style scoped='scoped'>
.c-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
}
  .header-logo {
    font-size:20px;
  }
  .header-logo span{
    font-size: 12px;
    margin-left: 10px;
  }

.header-tool span{
  margin-left: 10px;
  cursor: pointer;
}
  .item{
    margin:0 10px;
  }
  .header-logo a{
    text-decoration: none;
    color:#fff;
  }
  .el-steps{
    width:50%;
    margin:20px;
}
.tool-item{
  cursor: pointer;
}
.tool-item img{
  width:50px;
  height: 50px;
  border-radius: 50%;
  background: #fff;
  float: right;
  margin-left: 20px;
}
.icon-item{
  margin-top:16px;
  float:left;
}
</style>
