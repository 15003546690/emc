<template>
	<div class="fraction">
		<div class='fraction-top' id="target">
			<p>
				<!-- <span>被考评项名称：</span> -->
				<span>{{info.name}}</span>
				<span>{{info.groupName}}</span>
			</p>
			<div class="show-summary">
				<div class="zj-btn" @click="handleShowContent">工作总结<span :class="isShowContent ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" ></span></div>
				<div class="user-content" v-show="isShowContent" v-html="userContent"></div>
			</div>
			<!-- <p>
				<span>组织名称：</span>
				<span>{{info.groupName}}</span>
			</p> -->
		</div>
		<!-- <div class="fraction-range">
			<p>
				<span>打分范围：</span>
				<span>各指标打分范围均为{{score.min}}-{{score.max}}分</span>
			</p>
		</div> -->
		<div class="fraction-content2">
			<ul>
				<li class="tab-header">
					<span class="cell1">指标</span>
          <span class="cell1">占比</span>
					<span class="cell3">评分标准</span>
					<span class="cell3">评分方法</span>
					<span class="cell2">打分</span>
				</li>
				<li v-for='(i,index) in info.list' :key="index">
					<span class="cell1">{{i.targetName}}</span>
          <span class="cell1">{{i.targetWeight*100}}%</span>
					<span class="cell3 left">
            <p v-for="item in i.var1" :key="item">{{item}}</p>
					</span>
					<span class="cell3 left">
              <p v-for="item in i.var2" :key="item">{{item}}</p>
					</span>
					<span class="cell2"><el-input class="cell-input" v-model='i.score' @change="handleInputNumberChange(i.score,idx)"></el-input></span>
				</li>
			</ul>
		</div>
		<!-- <div class="fraction-content">
			<div class="fractionC-list"  v-for='(i,idx) in info.list'>
				<div>
					<span>{{i.targetName}} (占比 {{i.targetWeight*100}}%)</span>
					<span><el-input v-model='i.score' @change="handleInputNumberChange(i.score,idx)"></el-input></span>
				</div>
				<div>
					<p>{{i.var1}}</p>
				</div>
				<div>
					<p>{{i.var2}}</p>
				</div>
			</div>
		</div> -->
		<div class="fraction-remark">
			<p>评语：</p>
			<el-input type='textarea' rows='3' resize='none' v-model='info.remark'></el-input>
		</div>
		<div class='fraction-btn'>
			<el-button type='primary' @click='save()' style='background: #f9b382;border:none'>保存下一个</el-button>
			<el-button @click=cancel() style='border: solid 1px #afcbce'>取消</el-button>
			<el-button type='primary' @click='bzd()' v-if='etId!="074a355b40c111e99ff9ac1f6b6c77e8"'>不知道</el-button>
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
		created(){
			this.info=JSON.parse(sessionStorage.getItem("data"));
			// this.info=this.$route.query.data;
			this.currentData();
			this.getUserEditorContent(this.info.evId, this.info.eiId);
		},
		data(){
			return{
				etId:'',
				alert:{
					text:'保存成功',//提示的文字
					show:false,//显示隐藏
					type:'success'//显示类型
				},
				disabled:false,
				info:'',
				currentUserid: '',
				scoreTargets:[],
				isShowContent: false,
				userContent: '',
				score:{
					max:'',
					min:''
				}
			}
		},
		methods:{
			//点击不知道
			bzd(){
				this.scoreTargets=[];
				let data=this.info.list;
				for(let i=0;i<data.length;i++){
					this.scoreTargets.push({
						score:0,
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
					this.$nextTick(() => {
						document.documentElement.scrollTop=0;
					  document.body.scrollTop = 0;
					});
					// app.scrollIntoView();
					if(res.code!=200){
						this.alert.text=res.msg;
						this.alert.show=true;
						this.alert.type='error';
					}else{
						this.alert.text='保存成功'
						this.alert.show=true;
						this.alert.type='success';
						this.next();
					}
				})
			},
      aaa(val){
        var aaa = val.split('；');
        // console.log(aaa);
        return aaa;
      },
			next(){
				this.$CPOST('/score/notScoreNextOne',{
					evId:this.info.evId,
					etId:this.info.etId
				},(res) => {
					if(res.code==200){
						let data=res.data.targetVos;
						if(res.data.targetVos==null){
							this.disabled=true;
							this.alert.text='所有人评分完毕';
							this.alert.show=true;
							this.alert.type='success';
							// this.$router.push({'path':'/index/myEmcList'})
						}else{
							this.getUserEditorContent(res.data.evId, res.data.eiId);
							// sessionStorage.setItem("data",JSON.stringify(res.data));
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
              data.forEach((item) => {
                item.var1=this.aaa(item.var1);
                item.var2=this.aaa(item.var2);
              })
              this.info.list=data;
              this.getUserEditorContent(res.data.evId, res.data.eiId);
						}
					}
				})
			},
			currentData(){
				this.$CPOST('/evaluate/findEvaluate',{
					evId:this.info.evId
				},(res)=>{
					this.score.max=res.data.maxScore;
					this.score.min=res.data.minScore;
					this.etId=res.data.etId;
				})
			},
			getUserEditorContent (evId, eiId) {
				this.$CPOST('/evaluateItem/findDetail', {
					evId,
					eiId,
				}, (res) => {
					this.userContent = res.data.suContent;
				});
			},
			// changeNum(val,idx) {
			// 	let str = '' + this.info.list[idx].score;
			// 	if (str.indexOf('.') != -1) {
			// 		let arr = str.split('');
			// 		arr.splice(arr.length - 1);
			// 		let str2 = arr.join('');
			// 		this.info.list[idx].score = +str2;
   //      		} else {
   //      			this.info.list[idx].score = val.replace(/[^0-9.]/g,'');
			// 		if(val > this.score.max) {
			// 			this.info.list[idx].score = this.score.max;
			// 		}
			// 	}
			// },
			handleInputNumberChange (val, idx) {
				if  (val <= this.score.max && val >= this.score.min) {
					this.info.list[idx].score = (~val.indexOf('.')) ? Number(val).toFixed(1) : val
				} else {
					this.info.list[idx].score = val > this.score.max ? this.score.max : this.score.min;
				}
			},
			/*changeNum(val,idx){
				// .replace(/[^0-9.]/g,'')
				this.info.list[idx].score=val.replace(/[^0-9.]/g,'');
				if(val>this.score.max){
					this.info.list[idx].score=this.score.max;
				}
			},*/
			save(){
				if (this.info.list.some(t => t.score == 0)) {
					this.alert = {
						text: '评分不能为0', // 提示的文字
						show: true, // 显示隐藏
						type: 'error' // 显示类型
					};
					return false;
				}
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
					this.$nextTick(() => {
						document.documentElement.scrollTop=0;
					  document.body.scrollTop = 0;
					});
					// app.scrollIntoView();
					if(res.code!=200){
						this.alert.text=res.msg;
						this.alert.show=true;
						this.alert.type='error';
					}else{
						this.alert.text='保存成功'
						this.alert.show=true;
						this.alert.type='success';
						this.next();
					}
				})
			},
			cancel(){
				this.$router.push({'path':'/index/myEmcList'});
			},
			handleShowContent () {
				this.isShowContent = !this.isShowContent;
			}
		}
	}
</script>
<style scoped='scoped'>
.fraction{
	width: 100%;
	position: relative;
}
.fraction-top{
	width: 100%;
	background: #eee;
	padding: 20px;
}
.fraction-top i{
	position: fixed;
	display: inline-block;
	width: 10px;
	top: 0;
}
.fraction-top p{
	flex: 1;
	font-size: 20px;
    font-weight: bold;
}
.fraction-top p span:first-child{
	display:inline-block;
	width: 120px;
}
.fraction-range span:first-child{
	display:inline-block;
	width: 120px;
}
.fraction-content{
	padding: 20px;
	border-radius: 10px;
	margin-top: 10px;

/*	background: #afcbce;*/
}
.fractionC-list{
	padding: 10px;
	border: solid 1px #f5f5f5;
	margin-bottom:10px;
}
.fractionC-list div{
	margin-top: 10px;
}
.fractionC-list div:first-child{
	/*display: flex;*/
	align-items: center;
}
.fractionC-list div:last-child p{
	margin-top: 10px;
}
.fractionC-list div span{
	flex: 1;
}
.fractionC-list div p{
/*	flex: 1;*/
	display: flex;
	/*padding-right: 100px*/
}
.fractionC-list div p span:first-child{
	display: inline-block;

}
.fractionC-list div p div{
	margin-left: 28px;
}
.fraction-btn{
	width: 80%;
	display: flex;
	/*margin-bottom: 20px;*/
	position: fixed;
	bottom: 10px;
}
.fraction-btn button{
	flex: 1;
}
.fraction-remark{
	display: flex;
	align-items: center;
	margin-bottom: 60px;
}
.fraction-remark p{
	width: 65px;
	margin-right: 10px;
	font-weight: 600;
}
.user-content {
	height: auto;
	width: 100%;
	padding: 10px;
	border: 1px solid #ccc;
	margin-top: 5px;
	background: #fff;
}
.show-summary {
}
.show-summary span {
	margin-left: 10px;
}
.fraction-content2 li{
	display: flex;
	border-bottom:1px solid #eee;
}
.fraction-content2 li span.cell1{
	color:#666;
	padding:1%;
	flex: 1;
	/*text-align: right;*/
	border-right: 1px solid #eee;
  text-align:center;
}
.fraction-content2 li span.cell2{
	padding:1%;
	flex:1;
	border-right: 1px solid #eee;
  text-align:center;
}
.fraction-content2 li span.cell3{
	color:#666;
	padding:1%;
	flex: 5;
	border-right: 1px solid #eee;
  text-align:center;
}
.fraction-content2 li span.left{
  text-align: left;
}
.fraction-content2{
	margin: 20px 0;
	border:1px solid #eee;
	border-bottom:0px;
}
.tab-header{
}
.tab-header span{
	font-weight: 600;
	font-size: 18px;
}
.zj-btn{
	background:#4592af;
	width: 120px;
	height: 40px;
	margin:20px 0 0;
	line-height: 40px;
	color: #fff;
	border-radius: 5px;
	padding: 0 10px;
	cursor: pointer;
}
</style>
<style>
  .cell-input .el-input__inner{
    text-align: center;
  }
</style>
