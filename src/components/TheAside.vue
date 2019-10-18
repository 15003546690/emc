<template>
  <div class="c-aside">
    <el-menu default-active="2"
        active-text-color="#ff4400"
        text-color="#fff"
        :router="true"
        class="el-menu-vertical-demo">
        <div v-for='(i,index) in asideList'>
          <el-submenu :index="index+''" v-show='i.subs!=null'>
            <template slot="title">
              <i :class="i.icon"></i>
              <span>{{i.title}}</span>
            </template>
            <el-menu-item-group v-for='(j,idx) in i.subs' :key='idx'>
              <el-menu-item :index="'1-'+1" :route="{name: j.name}" >
                <router-link :to="j.src">
                    {{j.title}}
                </router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

            <el-menu-item  v-show='i.subs==null'>
              <router-link :to="i.src" class='zc-link'>
              <i :class="i.icon"></i>
              {{i.title}}
              </router-link>
            </el-menu-item>

        </div>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'TheAside',
  created(){
    if(this.$Token!=null){
      this.currentData();
    }
  },
  data () {
    return {
       asideList:[]
    };
  },
  methods: {
    currentData(){
      this.$UPOST('/api/umc/user/findUserByUserId',{
          userId:this.$zcId,
          menuId:this.$menuId
      },(res)=>{
        let data=res.data.roles[0].menuTreeList;
        for(let i=0;i<data.length;i++){
          this.asideList.push(data[i]);
        }
      })
    },
  }
};
</script>
<style>
  .el-menu-item-group__title{
   padding: 0!important;
   color:#fff;
  }
  .el-menu-item a{
    color:#fff;
  }
  .el-menu-item:hover,.el-submenu__title:hover{
  background:#665c84 !important;
  }
  .el-submenu .el-menu-item{
    min-width: 199px;
  }
</style>
<style scoped='scoped'>
.c-aside {
  height: 100%;
  width: 100%;
  background: #33313b;
}
.c-aside .iconfont{
  margin-right: 15px;
}
.el-menu,.el-submenu,.el-menu-item{
  background:#33313b;
  color:#fff;
}
.zc-link{
  display: inline-block;
  width: 100%;
}
</style>
