<template>
    <div>
        <div class="content-left">
            <h3 class="content-left-title">进行中<strong>{{unFinishCount}}</strong>个</h3>
            <ul class="index-list">
                <li v-for="(item, index) in progressList" :key="index">
                    <p class="list-item">
                        <label>考评名称：</label>
                        <span>{{item.evName}}</span>
                    </p>
                    <p class="list-item">
                        <label>评分总进度：</label>
                        <span class="progress-bar">
                            <el-progress :text-inside="true" :stroke-width="18" :percentage="item.progress"></el-progress>
                        </span>
                    </p>
                    <p class="list-item">
                        <label>未评分数量：</label>
                        <span><strong class="f20">{{item.ungradedQuantity}}</strong>/{{item.totalQuantity}}</span>
                    </p>
                   <!--  <p class="list-item">
                       <label>考评总数：</label>
                       <span>{{item.totalQuantity}}</span>
                   </p> -->
                    <p class="list-item">
                        <label>考评截止时间：</label>
                        <span>{{item.gradeEndTime}}</span>
                    </p>
                    <p class="list-item">
                        <label>指导语：</label>
                        <span>{{item.remark}}</span>
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        created(){
            if(!this.$webKit){
                this.$alert('建议使用谷歌浏览器', '温馨提示', {
                  confirmButtonText: '确定'
                });
            }
                /*this.$alert('建议使用谷歌浏览器', '温馨提示', {
                  confirmButtonText: '确定',
                });*/
          },
        name: '',
        data () {
            return {
                unFinishCount: 0,
                progressList: []
            };
        },
        mounted () {
            this.getEvaluateList();
        },
        methods: {
            getEvaluateList () {
                let _data = {
                    evaluationPeopleId: this.$zcId
                };
                this.$CPOST('/evaluate/evaluateSchedule', _data, res => {
                    if  (res.code === 200)  {
                        res.data.forEach(element => {
                            if (element.ungradedQuantity && element.gradedQuantity) {
                                element.progress = Math.round(Number(element.gradedQuantity) / Number(element.ungradedQuantity + element.gradedQuantity) * 100)
                            } else if (!element.ungradedQuantity && element.gradedQuantity) {
                                element.progress = 100;
                            } else {
                                element.progress = 0;
                            }
                        });
                        let filter = res.data.filter(item => {
                            return item.progress !== 100;
                        });
                        this.unFinishCount = filter.length;
                        this.progressList = res.data;
                    }
                }, err => {});
            }
        }
    }
</script>

<style scoped>
.content-left {}
.content-left-title{
    line-height: 30px;
    padding-left: 10px;
    border-left: 3px solid #1ab394;
    margin-bottom: 10px;
}
.index-list{
    width:100%;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
}
.index-list li{
    flex: 1;
    min-width: 45%;
    height: auto;
    padding:10px 0;
    border:1px solid #e7eaec;
    background: #FAFAFB;
    margin: 10px;
}
.index-list li p{
    line-height: 30px;
    font-size: 14px;
}
.list-item{
    margin:0 10px;
}
.list-item label{
    width:100px;
    text-align: right;
    margin-right: 20px;
    display: inline-block;
    color:#333;
    font-weight: 600;
}
.list-item span{
    color:#666;
}
.progress-bar{
    width: 70%;
    height: 20px;
    vertical-align:-4px;
    display: inline-block;
}
.f20{
    font-size: 20px;
    color:red;
}
</style>