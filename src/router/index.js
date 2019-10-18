import Vue from 'vue';
import Router from 'vue-router';
// 移动端-------
const pIndexView = r => require.ensure([], r => (require('@/phone/index/index.vue')), 'pIndexView');
const Report = r => require.ensure([], r => (require('@/phone/report/index.vue')), 'Report');
const Evaluation = r => require.ensure([], r => (require('@/phone/evaluation/index.vue')), 'Evaluation');
const Score = r => require.ensure([], r => (require('@/phone/evaluation/score.vue')), 'Score');
const Detail = r => require.ensure([], r => (require('@/phone/report/detail.vue')), 'Detail');
const My = r => require.ensure([], r => (require('@/phone/my/index.vue')), 'My');
const MyRelationP = r => require.ensure([], r => (require('@/phone/my/relationP.vue')), 'MyRelationP');
// PC端-------
// const MainView = r => require.ensure([], r => (require('@/view/main.vue')), 'MainView');
// 首页
const IndexView = r => require.ensure([], r => (require('@/view/index/index.vue')), 'IndexView');
// 主页内容页
const IndexContent = r => require.ensure([], r => (require('@/view/index-content/index-content.vue')), 'IndexContent');
// 我的考评列表
const MyEmcList = r => require.ensure([], r => (require('@/view/emc-manage/myemc-list.vue')), 'MyEmcList');
// 发起考评
const StartEmc = r => require.ensure([], r => (require('@/view/emc-manage/start-emc.vue')), 'StartEmc');
// 考评关系新增
const AddRelation = r => require.ensure([], r => (require('@/view/rules-manage/add-relation.vue')), 'AddRelation');
// 考评设置
const EmcSetting = r => require.ensure([], r => (require('@/view/rules-manage/emc-setting.vue')), 'EmcSetting');
// 考核表新增
const AddChecklist = r => require.ensure([], r => (require('@/view/emctable-manage/add-checklist.vue')), 'AddChecklist'); // 考核表列表
// 考核表列表
const CheckList = r => require.ensure([], r => (require('@/view/emctable-manage/check-list.vue')), 'CheckList'); // 考核表新增
// 考评列表
const EmcList = r => require.ensure([], r => (require('@/view/table-manage/emc-list.vue')), 'EmcList'); // 考评列表
// 考评详情
const EmcInfo = r => require.ensure([], r => (require('@/view/table-manage/emc-info.vue')), 'EmcInfo'); // 考评列表
// 考评统计
const EmcStatistics = r => require.ensure([], r => (require('@/view/table-manage/emc-statistics.vue')), 'EmcStatistics'); // 考评统计
// 绩效总表
const PFMList = r => require.ensure([], r => (require('@/view/table-manage/pfm-list.vue')), 'PFMList'); // 绩效总表
// 我的绩效总表
const MyPfmList = r => require.ensure([], r => (require('@/view/table-manage/mypfmlist.vue')), 'MyPfmList'); // 我的绩效总表
// 考评类型新增
const AddChecktype = r => require.ensure([], r => (require('@/view/base-msg/add-checktype.vue')), 'AddChecktype'); // 绩效总表
// 发起类型新增
const AddStarttype = r => require.ensure([], r => (require('@/view/base-msg/add-starttype.vue')), 'AddStarttype'); // 绩效总表
// 考评类型列表
const ChecktypeList = r => require.ensure([], r => (require('@/view/base-msg/checktype-list.vue')), 'ChecktypeList'); // 绩效总表
// 发起考评列表
const StarttypeList = r => require.ensure([], r => (require('@/view/base-msg/starttype-list.vue')), 'StarttypeList'); // 绩效总表
// 我的总结
const MySummarize = r => require.ensure([], r => (require('@/view/my-manage/my-summarize.vue')), 'MySummarize'); // 我的总结
// 总结列表
const SummarizeList = r => require.ensure([], r => (require('@/view/my-manage/summarize-list.vue')), 'SummarizeList'); // 总结列表
// 指标列表
const TargetList = r => require.ensure([], r => (require('@/view/target-manage/target-list.vue')), 'TargetList'); // 指标列表
// 指标新增
const AddTarget = r => require.ensure([], r => (require('@/view/target-manage/add-target.vue')), 'AddTarget'); // 指标新增
// 评分
const Fraction = r => require.ensure([], r => (require('@/view/fraction/index.vue')), 'Fraction');
// 我的评分关系
const Relation = r => require.ensure([], r => (require('@/view/my-manage/relation.vue')), 'Relation');
// 我的评语
const Remark = r => require.ensure([], r => (require('@/view/my-manage/remark.vue')), 'Remark');
// 帮助
const Help = r => require.ensure([], r => (require('@/view/help/index.vue')), 'Help');
// 平均分列表
const AverageScore = r => require.ensure([], r => (require('@/view/table-manage/average-score-list.vue')), 'AverageScore');
// 评级列表
const RatingList = r => require.ensure([], r => (require('@/view/base-msg/rating-list.vue')), 'RatingList');
//数据指标参考
const Indicators = r => require.ensure([], r => (require('@/view/emc-manage/indicators.vue')), 'Indicators');
Vue.use(Router);
let routeList = [];
if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
  routeList = [
    {
      path: '*',
      // name: 'IndexView',
      component: pIndexView,
      redirect: '/index/Evaluation',
      children: [
        {
          path: '/index/Report',
          name: 'Report',
          component: Report
        },
        {
          path: '/index/Evaluation',
          name: 'Evaluation',
          component: Evaluation
        },
        {
          path: '/index/Evaluation/score',
          name: 'Score',
          component: Score
        },
        {
          path: '/index/Report/detail',
          name: 'Detail',
          component: Detail
        },
        {
          path: '/index/my',
          name: 'My',
          component: My
        },
        {
          path: '/index/my/relation',
          name: 'MyRelationP',
          component: MyRelationP
        },
      ]
    }
  ]
}else{
  routeList=[
    {
      path: '/',
      name: 'MainView',
      redirect: '/index'
      // component: MainView
    },
    {
      path: '/index',
      // name: 'IndexView',
      component: IndexView,
      children: [
        {
          path: '/',
          redirect: '/index/IndexContent'
        },
        {
          path: '/index/IndexContent',
          name: 'IndexContent',
          component: IndexContent
        },
        {
          path: '/index/myEmcList',
          name: 'MyEmcList',
          component: MyEmcList
        },
        {
          path: '/index/startEmc',
          name: 'StartEmc',
          component: StartEmc
        },
        {
          path: '/index/indicators',
          name: 'Indicators',
          component: Indicators
        },
        {
          path: '/index/addRelation',
          name: 'AddRelation',
          component: AddRelation
        },
        {
          path: '/index/emcSetting',
          name: 'EmcSetting',
          component: EmcSetting
        },
        {
          path: '/index/addChecklist',
          name: 'AddChecklist',
          component: AddChecklist
        },
        {
          path: '/index/checkList',
          name: 'CheckList',
          component: CheckList
        },
        {
          path: '/index/emcList',
          name: 'EmcList',
          component: EmcList
        },
        {
          path: '/index/emcInfo',
          name: 'EmcInfo',
          component: EmcInfo
        },
        {
          path: '/index/emcStatistics',
          name: 'EmcStatistics',
          component: EmcStatistics
        },
        {
          path: '/index/PFMList',
          name: 'PFMList',
          component: PFMList
        },
        {
          path: '/index/MyPfmList',
          name: 'MyPfmList',
          component: MyPfmList
        },
        {
          path: '/index/addChecktype',
          name: 'AddChecktype',
          component: AddChecktype
        },
        {
          path: '/index/addStarttype',
          name: 'AddStarttype',
          component: AddStarttype
        },
        {
          path: '/index/checktypeList',
          name: 'ChecktypeList',
          component: ChecktypeList
        },
        {
          path: '/index/starttypeList',
          name: 'StarttypeList',
          component: StarttypeList
        },
        {
          path: '/index/mySummarize',
          name: 'MySummarize',
          component: MySummarize
        },
        {
          path: '/index/summarizeList',
          name: 'SummarizeList',
          component: SummarizeList
        },
        {
          path: '/index/remark',
          name: 'Remark',
          component: Remark
        },
        {
          path: '/index/relation',
          name: 'Relation',
          component: Relation
        },
        {
          path: '/index/TargetList',
          name: 'TargetList',
          component: TargetList
        },
        {
          path: '/index/AddTarget',
          name: 'AddTarget',
          component: AddTarget
        },
        {
          path: '/index/Fraction',
          name: 'Fraction',
          component: Fraction
        },
        {
          path: '/index/Help',
          name: 'Help',
          component: Help
        },
        {
          path: '/index/AverageScore',
          name: 'AverageScore',
          component: AverageScore
        },
        {
          path: '/index/RatingList',
          name: 'RatingList',
          component: RatingList
        }
      ]
    }
  ]
}
export default new Router({
  linkActiveClass: 'is-active',
  routes: routeList
  /*routes: [
    {
      path: '/',
      name: 'MainView',
      redirect: '/index'
      // component: MainView
    },
    {
      path: '/index',
      // name: 'IndexView',
      component: IndexView,
      children: [
        {
          path: '/',
          redirect: '/index/IndexContent'
        },
        {
          path: '/index/IndexContent',
          name: 'IndexContent',
          component: IndexContent
        },
        {
          path: '/index/myEmcList',
          name: 'MyEmcList',
          component: MyEmcList
        },
        {
          path: '/index/startEmc',
          name: 'StartEmc',
          component: StartEmc
        },
        {
          path: '/index/addRelation',
          name: 'AddRelation',
          component: AddRelation
        },
        {
          path: '/index/emcSetting',
          name: 'EmcSetting',
          component: EmcSetting
        },
        {
          path: '/index/addChecklist',
          name: 'AddChecklist',
          component: AddChecklist
        },
        {
          path: '/index/checkList',
          name: 'CheckList',
          component: CheckList
        },
        {
          path: '/index/emcList',
          name: 'EmcList',
          component: EmcList
        },
        {
          path: '/index/emcInfo',
          name: 'EmcInfo',
          component: EmcInfo
        },
        {
          path: '/index/emcStatistics',
          name: 'EmcStatistics',
          component: EmcStatistics
        },
        {
          path: '/index/PFMList',
          name: 'PFMList',
          component: PFMList
        },
        {
          path: '/index/addChecktype',
          name: 'AddChecktype',
          component: AddChecktype
        },
        {
          path: '/index/addStarttype',
          name: 'AddStarttype',
          component: AddStarttype
        },
        {
          path: '/index/checktypeList',
          name: 'ChecktypeList',
          component: ChecktypeList
        },
        {
          path: '/index/starttypeList',
          name: 'StarttypeList',
          component: StarttypeList
        },
        {
          path: '/index/mySummarize',
          name: 'MySummarize',
          component: MySummarize
        },
        {
          path: '/index/summarizeList',
          name: 'SummarizeList',
          component: SummarizeList
        },
        {
          path: '/index/remark',
          name: 'Remark',
          component: Remark
        },
        {
          path: '/index/relation',
          name: 'Relation',
          component: Relation
        },
        {
          path: '/index/TargetList',
          name: 'TargetList',
          component: TargetList
        },
        {
          path: '/index/AddTarget',
          name: 'AddTarget',
          component: AddTarget
        },
        {
          path: '/index/Fraction',
          name: 'Fraction',
          component: Fraction
        },
        {
          path: '/index/Help',
          name: 'Help',
          component: Help
        }
      ]
    }
  ]*/
});
