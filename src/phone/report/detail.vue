<template>
	<div class="detail">
		<mt-header fixed :title=title>
			<router-link :to=path slot="left" style='color: #fff;'>
			    <mt-button icon="back">返回</mt-button>
			  </router-link>
			<!-- <mt-button icon="back">返回</mt-button> -->
		</mt-header>
		<p style="padding: 0 0 10px 10px;"><span>实际总得分：</span>{{score}}</p>
		<div class="detail-content" v-for='i in info'>
			<p class="detailC-title">{{i.name}}</p>
			<div class="detailC-main" v-for='j in i.scoreDetailDtos'>
				<p><span>评分人：</span><span>{{j.socrerName}}</span></p>
				<p><span>评分时间：</span><span>{{j.createtime}}</span></p>
				<div class="main-kpi" v-for='z in j.sBaseList'>
					<p><span>{{z.targetName}}({{z.targetWeight}})：</span><span>{{z.score}}</span></p>
				</div>
				<p><span>评语：</span><span>{{j.remark}}</span></p>
			</div>
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
				title:'',
				score:'8.8',
				info:[],
				path:''
			}
		},
		methods:{
			currentData(){
				const loading = this.$loading(this.$store.state.loading);
				let query=this.$route.query;
				if(query.path=='index'){
					this.path='/index/Report'
				}else{
					this.path='/index/Evaluation'
				}
				this.$CPOST('/score/findScoreDetail',{
					eiId:query.eiId,
					evId:query.evId,
					rsId:query.rsId
				},(res)=>{
					loading.close();
					let data=res.data,list=data.formScoreDtos;
					this.title=data.eiName+'评分详情';
					this.score=data.scoreTotal;
					for(let i=0;i<list.length;i++){
						let scoreDetailDtos=list[i].scoreDetailDtos;
						this.info.push({
							name:list[i].efName,
							scoreDetailDtos:[]
						})
						for(let j=0;j<scoreDetailDtos.length;j++){
							this.info[i].scoreDetailDtos.push({
								socrerName:scoreDetailDtos[j].socrerName,
								createtime:scoreDetailDtos[j].createtime,
								remark:scoreDetailDtos[j].remark,
								sBaseList:[]
							})
							let scoreBaseList=scoreDetailDtos[j].scoreBaseList;
							for(let z=0;z<scoreBaseList.length;z++){
								this.info[i].scoreDetailDtos[j].sBaseList.push({
									targetName:scoreBaseList[z].targetName,
									targetWeight:scoreBaseList[z].targetWeight*100+'%',
									score:scoreBaseList[z].score
								})
							}
						}
					}
				})
			}
		}
	}
</script>
<style scpoed='scoped'>
	.detail{
		font-size: 14px;
	}
	.detail-content{
		padding: 10px 10px;
		background: #f8f8f8;
	}
	.detailC-title{
		margin-bottom: 10px;
		
	}
	.detailC-main{
		background: #DCDFE6;
		padding:10px 0;
	}
	.detailC-main p{
		line-height: 28px;
		padding:0 10px;
	}
</style>