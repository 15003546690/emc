<template>
	<div class='add-check'>
		<h2 class="addC-head">考评类型新增</h2>
		<div class="addC-content">
			<div class='addCC-top'>
				<p><span>考评类型名称：</span><el-input v-model='name'></el-input></p>
				<p><span>备注：</span><el-input v-model='remarks'></el-input></p>
			</div>
			<div class='addC-btn-group'>
				<el-button type="primary" @click='save()'>保存</el-button>
				<el-button  @click='cancel()'>取消</el-button>
			</div>
		</div>
		<Layer :text='alert' v-show='alert.show'></Layer>
	</div>
</template>
<script>
import Layer from '../common/layer.vue';
	export default{
		components:{
			Layer
		},
		data(){
			return{
				alert:{
					text:'保存成功',
					show:false,
					type:'success'
				},
				success:false,
				erro:false,
				name:null,
				remarks:null,
				erroKey:null
			}
		},
		methods:{
			save(){
				if(this.name==null||this.name==''||this.name==undefined){
						this.alert.text='考评类型名称不能为空';
						this.alert.show=true;
						this.alert.type='error';
					}else{
				this.$CPOST('/evaluateType/addEvaluateType',{
					etName:this.name,
					remark:this.remarks
				},(res)=>{
					if(res.code==200){
						this.name=null;
						this.remarks=null;
						this.alert.text='保存成功';
						this.alert.type='success';
						this.alert.show=true;
					}else if(res.code!=200){
						this.alert.type='error';
						this.alert.text=res.msg;
						this.alert.show=true;
					}
				})}
			},
			cancel(){
				this.$router.push({path:'/index/checktypeList'})
			}
		}
	}
</script>
<style scoped='scoped'>
	.alt{
		margin-bottom: 30px;
	}
	.addC-head{
		margin-bottom: 50px;
	}
	.addCC-top{
		width: 500px;
	}
	.addCC-top p{
		display: flex;
		margin-bottom: 20px;
	}
	.addCC-top p span{
		display: flex;
		width: 170px;
		justify-content: center;
		align-items: center;
	}
	.addC-btn-group{
		width: 500px;
		display: flex;
		margin-top: 150px;
	}
	.addC-btn-group button{
		flex: 1
	}
</style>