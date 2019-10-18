<template>
	<div class="score">
		<mt-header fixed title="评分">
			<router-link to="/index/Evaluation" slot="left">
			    <mt-button icon="back" style='color: #fff;'>返回</mt-button>
			</router-link>
		</mt-header>
		<div class="score-content">
			<div class="scoreC-top">
				<p><span>被考评项名称：</span><span>{{info.name}}</span></p>
				<p><span>组织名称：</span><span>{{info.groupName}}</span></p>
			</div>
			<div class="scoreC-main">
				<div class="scoreCM-list" v-for='(i,idx) in info.list'>
					<p class="scoreCM-p"><span>{{i.targetName}} ( {{i.targetWeight*100}}% ) ：</span><span><el-input placeholder='请输入分值' @input='changeNum(i.score,idx)' v-model='i.score'></el-input></span></p>
					<p class="scoreCM-T" v-show="i.var1!=''"><span>绩效标准：</span><span>{{i.var1}}</span></p>
					<p class="scoreCM-T" v-show="i.var2!=''"><span>评分方法：</span><span>{{i.var2}}</span></p>
				</div>
			</div>
			<div class="scoreC-bottom">
				<el-input placeholder='请输入评语' v-model='info.remark'></el-input>
			</div>
			<div class="btn-group">
				<el-button type='primary' @click='save()'>保存</el-button>
				<el-button @click='next()' :disabled='disabled'>下一条</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { MessageBox } from 'mint-ui';
	export default{
		created(){
			this.info=this.$route.query.data;
		},
		data(){
			return{
				info:'',
				scoreTargets:[],
				disabled:false
			}
		},
		methods:{
			next(){
				this.$CPOST('/score/notScoreNextOne',{
					evId:this.info.evId,
					etId:this.info.etId
				},(res)=>{
					if(res.code==200){
						this.$nextTick(() => {
							document.documentElement.scrollTop=0;
						    document.body.scrollTop = 0;
						});
						let data=res.data.targetVos;
						if(res.data.targetVos==null){
							this.disabled=true;
							MessageBox('提示', '所有人评分完毕');
						}else{
							this.info.eiId=res.data.eiId;
							this.info.evId=res.data.evId;
							this.info.etId=res.data.etId;
							this.info.rsId=res.data.rsId;
							this.info.middleId=res.data.middleId;
							this.info.list=data;
							this.info.name=res.data.eiName;
							this.info.groupName=res.data.orgName;
							this.info.remark=res.data.remark;
							this.score.min=res.data.minScore;
							this.score.max=res.data.maxScore;
						}
					}
				})
			},
			changeNum(val,idx){
				this.info.list[idx].score=val.replace(/[^\d.]/g,"");
			},
			save(){
				this.scoreTargets=[];
				let data=this.info.list;
				for(let i=0;i<data.length;i++){
					this.scoreTargets.push({
						score:data[i].score,
						targetId:data[i].targetId
					})
				}
				this.$CPOST('/score/addScore',{
					evId:this.info.evId,
					evPeopleId:this.info.evPeopleId,
					eiId:this.info.eiId,
					etId:this.info.etId,
					efId:this.info.efId,
					middleId:this.info.middleId,
					rsId:this.info.rsId,
					scoreTargetList:JSON.stringify(this.scoreTargets),
					remark:this.info.remark
				},(res)=>{
					if(res.code!=200){
						MessageBox('提示', res.msg);
					}else{
						MessageBox('提示', '保存成功');
					}
				})
			}
		}
	}
</script>
<style>
	.scoreCM-p input,.scoreCM-p input .el-input{
		height: 30px;
		line-height: 30px;
	}
</style>
<style scoped='scoped'>
	.btn-group{
		margin-top: 20px;
		display: flex;
	}
	.btn-group button{
		flex: 1;
	}
	.score{
		font-size: 14px;
	}
	.score-content{
		padding: 10px;
	}
	.scoreC-top p{
		line-height: 28px;
	}
	.scoreCM-list{
		padding: 10px;
		background: #f8f8f8;
		margin-top: 10px;
	}
	.scoreCM-list p{
		display: flex;
		line-height: 30px;
	}
	.scoreCM-p input{
		height: 30px !important;
	}
	.scoreCM-list p:first-child{
		justify-content: center;
		align-items: center;
	}
	.scoreCM-p span:first-child{
		width: 45%;
	}
	.scoreCM-T span:first-child{
		width: 40%;
	}
	.scoreC-bottom{
		margin-top: 20px;
	}
</style>