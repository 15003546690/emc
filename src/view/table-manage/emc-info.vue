<template>
  <el-container class="emc-info">
    <el-header class="emc-info__header" height="130px">
      <div><b>{{userName}}</b> 的考评详情</div>
      <div>考评名称：<b>{{evName}}</b></div>
      <div>实际得分：<b>{{realScore}}</b></div>
      <div>分数调整：<b>{{desiScore}}</b></div>
    </el-header>
    <el-main class="emc-info__main">
      <div class="main-inner">
        <div class="inner-item" v-for="(item, index) in infoList" :key="index">
          <div class="item-title"><b>{{item.efName}}</b></div>
          <div class="item-block">
            <div class="block-people" v-for="(score, sIndex) in item.scoreDetailDtos" :key="sIndex">
              <div class="people-header">
                <div class="people-name">考评人: <span class="peo-val"><b>{{score.socrerName}}</b></span></div>
                <div class="people-weight">权重: <span class="peo-val"><b>{{Number(score.userWeight) * 100 + '%'}}</b></span></div>
                <div class="people-weight">权重得分: <span class="peo-val"><b>{{Number(score.userScore)}}</b></span></div>
                <div class="people-time">打分时间: <span class="peo-val"><b>{{score.createtime}}</b></span></div>
              </div>
              <div class="people-item">
                <div class="people-socre" v-for="(data, dIndex) in score.scoreBaseList" :key="dIndex">
                  <div class="score-label">{{data.targetName}}({{data.targetWeight*100}}%)</div>
                  <div class="socre-text">得分：<b>{{data.score}}</b></div>
                </div>
              </div>
              <div class="people-remark">
                评语: <b>{{score.remark}}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: 'EmcInfo',
  data () {
    return {
      userName: '',
      evName: '',
      realScore: '',
      desiScore: '',
      infoList: []
    };
  },
  mounted () {
    this.getEmcInfo();
  },
  methods: {
    getEmcInfo () {
      let _data = {};
      let obj = this.$route.query;
      for (const key in obj) {
        _data[key] = obj[key];
      }
      this.$CPOST('/score/findScoreDetail', _data, res => {
        if (res.code === 200) {
          this.userName = res.data.eiName;
          this.evName = res.data.evaluate.evName;
          this.realScore = res.data.scoreTotal;
          this.desiScore = res.data.desiScore;
          this.infoList = res.data.formScoreDtos;
        }
      }, err => {});
    }
  }
}
</script>
<style lang="scss">
.emc-info {
  height: 100%;
  width: 100%;
  color: #333;
}
.emc-info__header {
  padding: 10px 10px;
  background: rgb(236, 236, 236);
}
.emc-info__header>div {
  margin-bottom: 10px;
}
.emc-info__main {}
.people-header {
  display: flex;
  margin-bottom: 10px;
  background: rgb(236, 236, 236);
  border-radius: 3px;
  padding: 5px;
}
.people-header>div {
  padding: 5px;
  text-align: center;
}
.people-time {
  margin-left: 5px;
}
.item-title {
  height: 24px;
  line-height: 24px;
}
.inner-item {
  margin-bottom: 10px;
}
.item-block {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
.people-item {
  display: flex;
  flex-wrap: wrap;
}
.people-remark {
  border: 1px solid #ccc;
  padding: 10px;
}
.people-socre {
  border: 1px solid #ccc;
  border-radius: 3px;
  width: auto;
  padding: 10px;
  margin-bottom: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.score-label {
  padding: 5px;
  text-align: center;
}
.socre-text {
  text-align: center;
  margin-left: 5px;
  padding: 5px;
}
.peo-val {
  color: rgb(51, 51, 51);
}
</style>