<template>
	<div class="evaluation">
		<div class="ev-main">
			<h3>被考核人总结</h3>
			<div class="ev-content">
				<p class="evV-p">
					<span>被考核项名称：</span>
					<span>{{text.eiName}}</span>
					<!-- <el-input type='text' readonly="readonly" v-model='text.eiName'></el-input> -->
				</p>
				<p class="evV-p">
					<span>组织名称：</span>
					<span>{{text.orgName}}</span>
					<!-- <el-input type='text' readonly="readonly" v-model='text.orgName'></el-input> -->
				</p>
				<p class="evV-p">
					<span>总结：</span>
					<span v-html='text.suContent'></span>
					<!-- <el-input type='textarea' resize='none' readonly="readonly" v-model='text.suContent'> -->
							
					<!-- </el-input> -->
				</p>
				<p class="evV-p" style="margin-bottom: 20px;">
					<span>其他：</span>
					<span>{{text.other}}</span>
					<!-- <el-input type='text' readonly="readonly" v-model='text.other'></el-input> -->
				</p>
				<div v-for='i in text.list' class="ev-list">
					<p  class="evV-p"><span>打分人：</span><span>{{i.name}}</span></p>
					<p  class="evV-p"><span>平均分：</span><span>{{i.score}}</span></p>
				</div>
			</div>
			<div class='ev-btn el-icon-close' @click='close()'>
				<!-- <el-button type='primary' >关闭</el-button> -->
			</div>
		</div>
		
	</div>
</template>
<script>
	export default{
		created(){
		},
		props:[
			'text'
		],
		data(){
			return{
			}
		},
		methods:{
			close(){
				this.text.show=false;
			}
		}
	}
</script>
<style>
	.evaluation{
		position: fixed;
		z-index: 999999;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
	}
	.ev-main{
		/*margin-left: 220px;
		margin-top: 80px;*/
		overflow-y: auto;
    	height: 500px;
		padding: 10px;
		width: 500px;
		background: #f5f5f5;
		position: fixed;
		top: 0px;
    	left: 0px;
    	z-index: 99999;
    	left: 50%;
    	top: 50%;
    	transform: translate(-50%,-50%); 
	}
	.evaluation h3{
		text-align: center;
	}
	.ev-content{
		padding: 20px;
		border-radius: 10px;
		margin:30px 0;
	}
	.evV-p{
		line-height: 40px;
		display: flex;
	}
	.evV-p span:first-child{
		display: inline-block;
		width: 150px;
		text-align: right;
	}
	.ev-btn{
		display: flex;
		justify-content: center;
		position: absolute;
		top: 0;
		right: 0;
		cursor: pointer;
		font-size: 20px;
	}
	.evV-p span:last-child p{
		width: 288px;
	}
	.ev-list{
		display: flex;
		margin-left: 40px;
	}
	.ev-list p:first-child{
		width: 230px;
	}
	.ev-list p span{
		text-align: left !important;
	}
	.ev-list p span:first-child{
		width: 70px;
	}
</style>
