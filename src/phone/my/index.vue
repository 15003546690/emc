<template>
	<div class="my">
		<mt-header fixed title="绩效总表"></mt-header>
		<div class="my-list">
			<div class="list-bar">
				<router-link to='/index/my/relation'>
				<p class="iconfont icon-guanxitu"></p>
				<p style="font-size: 14px;">考评关系</p>
				</router-link>
			</div>
			<div class="list-bar"></div>
			<div class="list-bar"></div>
			<div class="list-bar"></div>
		</div>
		<div class="my-content">
			<div class="my-info">
				<p><span>名称：</span><span>{{name}}</span></p>
				<p><span>组织：</span><span>{{organization}}</span></p>
				<p><span>职级：</span><span>{{leve}}</span></p>
			</div>
			<el-button @click='out()' type='primary'>退出</el-button>
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
				name:'',
				organization:'',
				leve:'',
			}
		},
		methods:{
			currentData(){
				this.$UPOST('/api/umc/user/findUserByUserId',{
					userId: this.$zcId
				},(res)=>{
					let data=res.data;
					this.name=data.userName,
					this.organization=data.organizationPositions[0].orgname;
					this.leve=data.organizationPositions[0].positionName;
				})
			},
			out(){
				this.$DelCookie('id');
			      this.$DelCookie('zctoken');
			      this.$DelCookie('token');
			      this.$DelCookie('menuId');
			      // location.reload();
			      let host=window.location.hostname;
			      if(host=="192.168.112.210"){//测试
			        window.location.href='https://192.168.112.210:9007/#/login';
			      }else if(host=="192.168.112.168"){//正式内网
			        window.location.href='https://192.168.112.168:9007/#/login';
			      }else if(host=="58.30.9.142"){//正式外网
			        window.location.href='https://58.30.9.142:48082/#/login';
			      }else{
			        window.location.href='https://192.168.112.210:9007/#/login';
			      }
			}
		}
	}
</script>
<style scoped='scoped'>
	.my button{
		width: 100%;
	}
	.my-content{
		padding:0px 10px;
	}
	.my-info{
		padding: 10px;
		margin-bottom: 40px;
	}
	.my-info p{
		border-bottom: solid 1px #DCDFE6;
		line-height: 40px;
		font-size: 14px;
	}
	.my-list{
		display: flex;	
		justify-content: space-around;
	}
	.my-list .list-bar{
		width: 100px;
		height: 80px;
		/* justify-content: center;
		align-items: center; */
	}
	.list-bar p{
		text-align: center;
	}
	.list-bar p:first-child{
		margin:auto;
		font-size: 30px;
	}
	.list-bar:first-child{
		padding: 10px;
	}
</style>
