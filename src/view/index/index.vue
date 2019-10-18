<template>
  <el-container class="index-view">
    <el-header class="index-view__header">
      <c-header></c-header>
    </el-header>
    <el-container class="index-view__inner">
      <el-aside :class="active?'indexViewAside':'indexViewAsideS'">
        <div data-v-aa557f4e="" class="transXStart" :class="active?'aside-drawer':'aside-drawerS'" @click='shrink'><i data-v-aa557f4e="" :class="active?'el-icon-caret-left':'el-icon-caret-right'"></i></div>
        <c-aside></c-aside>
      </el-aside>
      <el-main class="index-view__main">
        <router-view class='routerV'></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import CHeader from '@/components/TheHeader';
import CAside from '@/components/TheAside';
export default {
  name: 'IndexView',
  /*watch:{
    $route(to,from){
      if(to.path=='/index/Fraction'){
        this.active=false;
      }
    }
  },*/
  components: {
    CHeader,
    CAside
  },
  data () {
    return {
      active:true
    };
  },
  methods: {
    shrink(){
      this.active=!this.active;
    }
  }
};
</script>
<style>
.index-view__header {
  background: #4592af;
  color:#fff;
}
  .routerV{
    position: relative;
  }
  .aside-drawer{
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 200px;
    height: 100px;
    width: 10px;
    cursor: pointer;
    border-radius: 3px;
    background: #4592af;
    color: #fff;
      transition:left 1s;
  -moz-transition:left 1s; /* Firefox 4 */
  -webkit-transition:left 1s; /* Safari and Chrome */
  -o-transition:left 1s; /* Opera */
}
.aside-drawerS{
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 0px;
  height: 100px;
  width: 10px;
  cursor: pointer;
  border-radius: 3px;
  background: #409EFF;
  color: #fff;
  transition:left 1s;
  -moz-transition:left 1s; /* Firefox 4 */
  -webkit-transition:left 1s; /* Safari and Chrome */
  -o-transition:left 1s; /* Opera */
}
.indexViewAside{
  width: 200px !important;
  transition:width 1s;
  -moz-transition:width 1s; /* Firefox 4 */
  -webkit-transition:width 1s; /* Safari and Chrome */
  -o-transition:width 1s; /* Opera */
}
.indexViewAsideS{
  width: 0px !important;
  transition:width 1s;
  -moz-transition:width 1s; /* Firefox 4 */
  -webkit-transition:width 1s; /* Safari and Chrome */
  -o-transition:width 1s; /* Opera */
}
</style>
