<template>
	<div class="ev">
		<mt-header fixed title="我的考评列表"></mt-header>
		<div style="padding: 0 10px;">
			<div class="score-header">
				<div>
					<el-button-group>
						<el-button :type="info.btnGroup==''?'primary':''" @click="all('全部')">全部</el-button>
						<el-button :type="info.btnGroup==1?'primary':''" @click="all('未考评')">未考评</el-button>
						<el-button :type="info.btnGroup==2?'primary':''" @click="all('已考评')">已考评</el-button>
					</el-button-group>
				</div>
				<div class="header-text">
					<p v-show='averageScore<6.5' class='zc-red'><span>平均分：</span>{{averageScore}}分</p>
        	<p v-show='averageScore>6.6' class='zc-red'><span>平均分：</span>{{averageScore}}分</p>
        	<p v-show='averageScore>=6.5 && averageScore<=6.6' class="zc-green"><span>平均分：</span>{{averageScore}}分</p>
				</div>
			</div>
	    <div class="ev-search">
				<el-select v-model="info.evId" placeholder="请选择考评" filterable clearable style='margin-left: 20px;'>
					<el-option
					  v-for="(s,index) in evaluationList"
					  :key='index'
					  :label="s.name"
					  :value="s.id">
					</el-option>
				</el-select>
				<el-select v-model="info.status" placeholder="请选择考评状态" filterable clearable>
					<el-option
					  v-for="(s,index) in stateList"
					  :key='index'
					  :label="s.name"
					  :value="s.id">
					</el-option>
				</el-select>
				<el-select v-model="info.etId" placeholder="请选择考评类型" filterable clearable>
					<el-option
					  v-for="(s,index) in evaluation"
					  :key='index'
					  :label="s.name"
					  :value="s.id">
					</el-option>
				</el-select>
				<el-select v-model="info.rsId" placeholder="请选择考核关系" filterable clearable>
					<el-option
					  v-for="(s,index) in surface"
					  :key='index'
					  :label="s.value"
					  :value="s.id">
					</el-option>
				</el-select>
				<el-button type='primary' @click='search'>搜索</el-button>
			</div>
			<div v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy" :infinite-scroll-distance="10">
			<div class="zc-nodata" v-show='detailList.length==0'>暂无数据</div>
			<div class="ev-total" v-show="detailList.length!=0">
				共{{this.evTotal}}条
			</div>
			<div class="report-list" v-for='i in detailList' v-show='detailList.length!=0'>

				<div class="reportL-left">
					<div class="reportLL-contetn">
						<div class="report-label" text-align='center'>
							<span v-show='i.status==0' style="color: red;">未考评</span>
							<span v-show='i.status!=0' style="color: green">已考评</span>
						</div>
						<div class="report-label">
							<p>
								<span>考评名称：</span><span>{{i.name}}</span>
							</p>
						</div>
						<div class="report-label">
							<p>
								<span>被考评项：</span><span>{{i.cover}}</span>
							</p>
						</div>
						<!-- <div class="report-label">
							<p>
								<span>打分状态：</span>
								<span v-show='i.status==0' style="color: red;">未考评</span>
								<span v-show='i.status!=0' style="color: green">已考评</span>
							</p>
						</div> -->
					</div>
				</div>
				<div class="reportL-right iconfont icon-pingfen zc-btn"	@click='scoring(i.evId,i)'>
					<!-- 打分 -->
				</div>
				<div class="reportL-right iconfont icon-details zc-btn"	@click='zcDetail(i.evId,i)'>
					<!-- 打分 -->
				</div>
			</div>
			<div style="line-height: 50px;text-align: center; color: #999" v-show='detailList.length>0&&!busy'>没有更多了</div>
			</div>
		</div>

	</div>
</template>
<script>
import { MessageBox ,loading,InfiniteScroll } from 'mint-ui';
	export default{
		created(){
			this.currentData();
			/*setTimeout(()=>{
				this.currentList(this.info.etId,this.info.gradeStatus,this.info.efId,this.info.evId,this.info.status);
			},800);*/
		},
		data(){
			return {
				averageScore: '', // 平均分
				surface:[],//考核关系
				pageNo:1,
				busy: true,
				evTotal:'',
				score:{//点击评分所需要的东西
		          list:[],
		          name:'',
		          groupName:'',
		          evId:'',
		          evPeopleId:'',
		          eiId:'',
		          efId:'',
		          etId:'',
		          middleId:'',
		          rsId:''
		        },
				info:{
					btnGroup:'',
					gradeStatus:'',//全部、已考评、未考评、
					etId:'',//考评类型
					efId:'',
					evId:'',//考评
					status:'',
					rsId:''
				},
				detailList:[],
				btnGroup:'',
				evaluationList:[],
				evaluation:[],//员工、产品、部门、项目
				stateList:[{
		          id:0,
		          name:'未开始'
		        },{
		          id:1,
		          name:'已开始'
		        },{
		          id:2,
		          name:'已结束'
		        }]
			}
		},
		methods:{
			loadMore(){
				if(this.busy){
				  setTimeout(()=>{
						this.currentList(this.info.etId,this.info.gradeStatus,this.info.efId,this.info.evId,this.info.status,this.info.rsId);
						this.average(this.info.etId, this.info.gradeStatus, this.info.rsId, this.info.evId, this.info.status);
						// this.pageNo++
					},1000);
				}
			},
			//打分详情
			detail(val){
				this.$CPOST('/score/findScoreTarget',{
				  evId:val.evId,
				  eiId:val.eiId,
				  efId:val.efId,
          		  middleId:val.middleId
				},(res)=>{
				  if(res.code==200){
				    let data=res.data.targetVos;
				    for(let i=0;i<data.length;i++){
				      this.score.list.push({
				        targetName:data[i].targetName,//指标名称
				        targetWeight:data[i].targetWeight,//占比
				        score:data[i].score,//分数
				        var1:data[i].var1,//绩效标准
				        var2:data[i].var2,//评分方法
				        targetId:data[i].targetId
				      })
				    }

				    this.score.name=val.cover;
				    this.score.groupName=res.data.orgName;
				    this.score.evId=val.evId;
				    this.score.evPeopleId=val.evPeopleId;
				    this.score.eiId=val.eiId;
				    this.score.efId=val.efId;
				    this.score.middleId=val.middleId;
				    this.score.rsId=val.rsId;
				    this.score.etId=this.info.etId;
				    this.score.remark=res.data.remark==null?'':res.data.remark;
				    this.$router.push({'path':'/index/Evaluation/score','query':{data:this.score}});
				  }else{
				    MessageBox('提示', res.msg);
				  }
				})
			},
			scoring(evId,i){
				this.$CPOST('/evaluate/isExamineTime',{
		          evId:evId
		        },(res)=>{
		          if(res.code!=200){
		            MessageBox('提示', res.msg);
		          }else{
		            this.detail(i);
		          }
		        })
			},
			search(){
				this.busy=true;
				this.pageNo=1;
				this.detailList=[];
				this.loadMore();
			},
			currentList(etId,gradeStatus,efId,evId,status,rsId){
				const loading = this.$loading(this.$store.state.loading);
				this.$CPOST('/score/MyScoreList',{
		          pageNum:this.pageNo,
		          pageSize:10,
		          etId:etId,
		          gradeStatus:gradeStatus,
		          efId:efId,
		          evId:evId,
		          status:status,
		          rsId:rsId
		        },(res)=>{
		        	loading.close();
		        	this.pageNo++
		        	if(res.code!=200){
		        		this.$DelCookie('id');
						this.$DelCookie('zctoken');
						this.$DelCookie('menuId');
						location.reload();
		        	}else{
		        		let data=res.data.list;
		        		let groupName;
    		        	if(this.pageNo>res.data.lastPage){
    			            this.busy=false;
    			          }
		        		for(let i=0;i<data.length;i++){
		        		  if(data[i].organizationPositions==null){
		        		    groupName=''
		        		  }else{
		        		    groupName=data[i].organizationPositions[0].orgname;
		        		  }
		        		  this.detailList.push({
		        		    name:data[i].evName,
		        		    cover:data[i].eiName,
		        		    status:data[i].gradeStatus,
		        		    evId:data[i].evId,
		        		    eiId:data[i].eiId,
		        		    efId:data[i].efId,
		        		    groupName:groupName,
		        		    etId:this.info.etId,//data[i].etId
		        		    evPeopleId:data[i].evPeopleId,
		        		    middleId:data[i].middleId,
		        		    rsId:data[i].rsId
		        		  })
		        		}
		        		this.evTotal=res.data.total;
		        	}
		        })
			},
			average(etId,gradeStatus,efId,evId,status){
        this.$CPOST('/score/findMyAvgScore',{
          etId:etId,
          gradeStatus:gradeStatus,
          rsId:efId,
          evId:evId,
          status:status
        },(res)=>{
          this.averageScore=res.data;
        })
      },
			currentData(){
				//考核关系
				this.$CPOST('/relation/findAboutMeRelationship',{

				},(res)=>{
				  let data=res.data;
				  for(let i=0;i<data.length;i++){
				    this.surface.push({
				      value:data[i].rsName,
				      id:data[i].rsId
				    })
				  }
				})
				this.$CPOST('/evaluateType/findAllEvaluateType',{

				},(res)=>{
					let data=res.data.list;
					for(let i=0;i<data.length;i++){
						this.evaluation.push({
							id:data[i].etId,
							name:data[i].etName
						})
					}
					this.info.etId=data[0].etId;
				})
				//请选择考评
		        this.$CPOST('/evaluate/findAllEvaluate',{
		        },(res)=>{
		          let data=res.data.list;
		          for(let i=0;i<data.length;i++){
		            this.evaluationList.push({
		              id:data[i].evId,
		              name:data[i].evName
		            })
		          }
		        });
			},
			all(val){
				if(val=='全部'){
				  this.info.gradeStatus='';
				  this.info.btnGroup='';
				  this.search();
				}else if(val=='未考评'){
				  this.info.gradeStatus=0;
				  this.info.btnGroup=1;
				  this.search();
				}else{
				  this.info.gradeStatus=1;
				  this.info.btnGroup=2;
				  this.search();
				}
			},
			//详情跳转
			zcDetail(i,_d){
				this.$router.push({
					path:'/index/report/detail',
					query:{
						evId:_d.evId,
						eiId:_d.eiId,
						rsId:_d.rsId
					}})
			}
		}
	}
</script>
<style scoped='scoped'>
	.ev-search{
		margin-bottom: 20px;
	}
	.mint-header{
		z-index: 9999 !important;
	}
	.ev-search .el-select,.ev-search button{
		width: 100%;
		margin-top: 10px;
		margin-left: 0 !important;
	}
	.report-list{
		background: #f7f7f7;
		display: flex;
		padding: 10px;
		border-bottom: 1px solid #fff;
		/*background: #f8f8f8;*/
	}
	.reportL-left{
		width: 80%;
		color: #909399;
		border-right: #333;
	}
	.reportLL-contetn{
		font-size: 14px;
		/*background: red;*/
	}
	.report-label{
		display: flex;
	}
	.report-label p{
		flex: 1;
		margin-bottom: 5px;
	}
	.report-label p span:first-child{
		color: #606266;
	}
	.reportL-right{
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #26a2ff;
	}
	.zc-nodata{
		width: 100%;
		text-align: center;
		color: #909399;
	}
	.reportLL-contetn .report-label:first-child{
		margin-bottom: 10px;
		padding: 5px;
		width: 60px;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.ev-total{
		padding: 5px;
		color: #606266;
	}
	.score-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.header-text {
		font-weight: bold;
	}
	.header-text span {
		color: #333;
	}
	.zc-green {
		color: green;
	}
	.zc-red{
    color: red;
  }
</style>
