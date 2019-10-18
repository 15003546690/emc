<template>
	<!-- 严重声明：未经本人允许不得转载 -->
	<!-- 
		dom:<Layer :text='alert' v-show='alert.show'></Layer>
		用法：
		import Layer from '../common/layer.vue';
		components:{
			Layer
		},
		子组件data格式{
			alert:{
				text:'保存成功',//提示的文字
				show:false,//显示隐藏
				type:'success'//显示类型
			},
		}
		触发：
		this.alert.text='考评类型名称不能为空';//展示提示文字，string。不传默提成('成功')
		this.alert.show=true;//对应上文data显示隐藏
		this.alert.type='error';//显示类型
	 -->
	<div class="layer">
		<el-alert
			class='alt'
			:title="text.text"
			:type="text.type=='success'?'success':'error'"
			show-icon>
		</el-alert>
	</div>
</template>
<script>
	export default{
		watch:{
	        'text.show': {
	            deep: true,
	            handler: function (val){
	            	if(val==true){
	            		setTimeout(()=>{
	            			this.text.text='成功'
							this.text.show=false;
						},3000)
	            	}
	            }
	        }
	    },
		props:[
			'text'
		],
		data(){
			return{
			}
		}
	}
</script>
<style scoped='scoped'>
	.layer{
		margin-left: 220px;
		margin-top: 80px;
		position: fixed;
		width: 70%;
		top: 0px;
    	left: 0px;
    	z-index: 99999;
	}
</style>