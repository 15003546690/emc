<template>
	<div class="phone-index">
		<div class="content">
			<router-view class='routerV'></router-view>
		</div>
		<div class="nav-bar">
			<mt-tabbar v-model="selected">
				<mt-tab-item id="kp">
					<router-link to='/index/Evaluation'>
					<p class="iconfont icon-jixiaokaoping"></p>
					考评
					</router-link>
				</mt-tab-item>
				<mt-tab-item id="bb">
					<router-link to='/index/Report'>
					<p class="iconfont icon-forms"></p>
					报表
					</router-link>
				</mt-tab-item>
				<mt-tab-item id="my">
					<router-link to='/index/my'>
				    <p class="iconfont icon-wode"></p>
				    我的
				</router-link>
				</mt-tab-item>
			</mt-tabbar>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				selected:'kp'
			}
		}
	}
</script>
<style scpoed='scoped'>
	.content{
		padding:50px 0;
	}
	.nav-bar{
		position: fixed;
		width: 100%;
		bottom: 0;
	}
	.nav-bar a{
		display: inline-block;
		width: 100%;
	}
	.iconfont{
		margin-bottom: 5px;
	}
</style>