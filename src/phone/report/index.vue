<template>
	<div class="report">
		<mt-header fixed title="绩效总表"></mt-header>
		<div class="report-content">
			<div class="reportC-search">
				<el-select v-model="model.coverName" placeholder="请输入被考核项" filterable clearable>
		          <el-option
		            v-for="(j,index) in info.coverName"
		            :key='index'
		            :label="j.value"
		            :value="j.id">
		          </el-option>
		        </el-select>
		        <el-select v-model="model.department" placeholder="请输入部门" filterable clearable>
		          <el-option
		            v-for="(j,index) in info.department"
		            :key='index'
		            :label="j.value"
		            :value="j.id">
		          </el-option>
		        </el-select>
		        <el-select v-model="model.evaluation" placeholder="请输入考评" filterable clearable>
		          <el-option
		            v-for="(j,index) in info.evaluation"
		            :key='index'
		            :label="j.value"
		            :value="j.id">
		          </el-option>
		        </el-select>
		        <el-select v-model="model.level" placeholder="请输入职级" filterable clearable>
		          <el-option
		            v-for="(j,index) in info.level"
		            :key='index'
		            :label="j.value"
		            :value="j.id">
		          </el-option>
		        </el-select>
		        <div class="reportCS-btn">
		        	<el-button type='primary' @click=order()>{{orde?'正序':'倒序'}}</el-button>
		        	<el-button type='primary' @click='searchL'>搜索</el-button>
		        </div>
			</div>
		</div>
		<div v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy" :infinite-scroll-distance="10">
			<div class="zc-nodata" v-show='detailList.length==0'>暂无数据</div>
			<div class="ev-total" v-show="detailList.length!=0">
				共{{this.evTotal}}条
			</div>
			<div class="report-list" v-show='detailList.length!=0' v-for='i in detailList'>
				<div class="reportL-left">
					<div class="reportLL-contetn">
						<div class="report-label">
							<p>
								<span>名称：</span><span>{{i.itemName}}</span>
							</p>
							<p>
								<span>职位：</span><span>{{i.positonName}}</span>
							</p>
						</div>
						<div class="report-label">
							<p>
								<span>总分：</span><span>{{i.totalScore}}</span>
							</p>
							<p>
								<span>评级：</span><span>{{i.socerLevel}}</span>
							</p>
						</div>
					</div>
				</div>
				<div class="reportL-right iconfont icon-details zc-btn"	@click='detail(i.evId,i.eiId,i.rsId)'>
					<!-- 详情 -->
				</div>
			</div>
			<div style="line-height: 50px;text-align: center; color: #999" v-show='detailList.length>0&&!busy'>没有更多了</div>
		</div>
	</div>
</template>
<script>
	export default{
		created(){
			this.currentData();
		},
		data(){
			return{
				busy: true,
				evTotal:'',//总数
				pageNo:1,
				loading: false,
				orde:true,
				model:{
					coverName:[],
					department:'',
					evaluation:'',
					level:''
				},
				info:{
					coverName:[],
					department:[],
					evaluation:[],
					level:[]
				},
				detailList:[],
				isAsc:'asc'
			}
		},
		methods:{
			loadMore(){
				if(this.busy){
				  setTimeout(()=>{
						this.search(this.isAsc);
					},1000);
				}
			},
			order(){
				this.pageNo=1;
				this.detailList=[];
				this.orde=!this.orde;
				if(this.orde){
					this.isAsc='asc';
					// this.search(this.isAsc);
					this.loadMore();
				}else{
					this.isAsc='desc';
					// this.search(this.isAsc);
					this.loadMore();
				}
			},
			currentData(){
				//被考核项渲染
				this.$CGET('/evaluateItem/findAll',{
				},(res)=>{
					let data=res.data;
					for(let i=0;i<data.length;i++){
						this.info.coverName.push({
							value:data[i].eiName,
							id:data[i].eiId
						});
					}
				});
				//部门渲染
				this.$UPOST('/api/umc/orignization/findOrgAll',{
				},(res)=>{
					let data=res.data;
					for(let i=0;i<data.length;i++){
					  this.info.department.push({
					    value:data[i].orgName,
					    id:data[i].orgId
					  })
					}
				});
				//考评
				this.$CPOST('/evaluate/findAllEvaluate',{
				},(res)=>{
					let data=res.data.list;
					this.model.evaluation=data[0].evId;
					for(let i=0;i<data.length;i++){
					  this.info.evaluation.push({
					    value:data[i].evName,
					    id:data[i].evId
					  })
					}
					// this.order();
				});
				//职级
				this.$UPOST('/api/umc/position/findPositionAll',{
				},(res)=>{
					let data=res.data;
					for(let i=0;i<data.length;i++){
					  this.info.level.push({
					    value:data[i].positionName,
					    id:data[i].positionId
					  })
					}
				});
			},
			//点击搜索
			searchL(){
				this.busy=true;
				this.pageNo=1;
				this.detailList=[];
				this.loadMore();
			},
			//一进来就渲染
			search(order){
				const loading = this.$loading(this.$store.state.loading);
				// this.detailList=[];
				this.$CPOST('/score/findTotalScoreList',{
					pageNo:this.pageNo,
					pageSize:10,
					eiId:this.model.coverName,
					evId:this.model.evaluation,
					orgId:this.model.department,
					positionId:this.model.level,
					order:order ? order : 'desc'
				},(res)=>{
					this.pageNo++
					loading.close();
					if(res.code!=200){
						MessageBox('错误提示', res.msg);
					}else{
						let data=res.data.list;
			        	if(this.pageNo>res.data.lastPage){
				            this.busy=false;
				          }
						for(let i=0;i<data.length;i++){
							this.detailList.push({
								itemName:data[i].itemName,
								positonName:data[i].positonName,
								totalScore:data[i].totalScore,
								socerLevel:data[i].socerLevel,
								evId:data[i].evId,
								eiId:data[i].itemId,
								rsId:data[i].rsId
							})
						}
						this.evTotal=res.data.total;
					}
				})
			},
			detail(evId,eiId,rsId){
				this.$router.push({path:'/index/report/detail',query:{evId,eiId,rsId,path:'index'}})
			}
		}
	}
</script>
<style scpoed='scoped'>
	.reportC-search{
		margin-bottom: 40px;
	}
	.report-content{
		padding:0px 10px;
	}
	.report-content .el-select{
		width: 100%;
		margin-bottom: 10px;
	}
	.reportCS-btn{
		display: flex;
	}
	.reportCS-btn button{
		flex: 1
	}
	.report-list{
		display: flex;
		padding: 10px;
		border-bottom: 1px solid #DCDFE6;
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
	.ev-total{
		padding: 5px;
		color: #606266;
		margin-left: 7px;
	}
</style>