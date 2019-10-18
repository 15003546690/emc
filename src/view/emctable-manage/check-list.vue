<template>
	<div>
		<h2 class="list-head">考核表列表,共<span>{{page.total}}</span>条</h2>
		<div class="list-content">
			<div class='list-search'>
				<el-select v-model="model.select" placeholder="请输入考核表名称" filterable clearable>
					<el-option
					  v-for="(item,index) in restaurants"
					  :key='index'
					  :label="item.name"
					  :value="item.itId">
					</el-option>
				</el-select>
				<el-select v-model="model.selectC" placeholder="请输入考核表编码" filterable clearable>
					<el-option
					  v-for="(item,index) in restaurantsC"
					  :key='index'
					  :label="item.value"
					  :value="item.value">
					</el-option>
				</el-select>
				<el-select v-model="model.selectI" placeholder="请输入KPI名称" filterable clearable>
					<el-option
					  v-for="(item,index) in restaurantsI"
					  :key='index'
					  :label="item.value"
					  :value="item.name">
					</el-option>
				</el-select>
				<el-button type="primary" @click='searchL()' style='margin-right: -5px;'>搜索</el-button>
				<el-button type="primary" @click='add()'>新增</el-button>
				<el-upload
				   class="setting-upload"
				   style='margin-right: 0'
				   :http-request='httpRequest'
				   action=""
				   :show-file-list="false"
				   accept=".xlsx"
				   :before-upload="fileBefore"
				   :on-success='fileSuccess'>
				   <el-button type='primary'>导入</el-button>
				 </el-upload>
				 <el-button type='primary' @click='exportE()' style='margin-right: 0;'>导出</el-button>
			</div>
			<div class='list-tab'>
				<el-table
				    :data="tableData"
				    :span-method="objectSpanMethod"
				    border
				    style="width: 100%">
				    <el-table-column
				      prop="number"
				      label="序号"
				      width="50">
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="考核表名称"
				      width="180">
				      <template slot-scope="scope">
				      	<el-input v-if='scope.row.show' v-model='scope.row.name'></el-input>
				      	<span v-else>{{scope.row.name}}</span>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="remarks"
				      label="考核表编码">
				      <template slot-scope="scope">
				      	<el-input v-if='scope.row.show' v-model='scope.row.remarks'></el-input>
				      	<span v-else>{{scope.row.remarks}}</span>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="targetName"
				      label="KPI名称">
				    </el-table-column>
				    <el-table-column
				      prop="targetWeight"
				      width=100
				      label="KPI权重">
				      <template slot-scope="scope">
				      	<el-input v-if='scope.row.show' v-model='scope.row.targetWeight' @input='changeNum(scope.row)' maxlength=3></el-input>
				      	<span v-else>{{parseInt(scope.row.targetWeight*100)}}%</span>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="targetWeight"
				      label="备注">
				      <template slot-scope="scope">
				      	<span>{{scope.row.remark}}</span>
				      </template>
				    </el-table-column>
				    <el-table-column label="操作" width=90>
				      <template slot-scope="scope">
					      <div class="iconfont icon-bianji zc-btn" @click="handleEdit(scope.$index, scope.row)"></div>
					      <div class="iconfont icon-shanchu zc-btn" style="color: red" @click="handleDelete(scope.$index, scope.row)"></div>
				      </template>
				    </el-table-column>
				</el-table>
			</div>
			<el-pagination
			  background
			  layout="prev, pager, next"
			  :page-size='5'
			  :current-page='page.current'
			  @current-change='currentC'
			  :total='this.page.total'>
			</el-pagination>
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
			this.curData(1);
			this.searchInput();
		},
		data(){
			return{
				model:{
					select:'',
					selectC:'',
					selectI:''
				},
				alert:{
					text:'保存成功',//提示的文字
					show:false,//显示隐藏
					type:'success'//显示类型
				},
				tableData: [],
				restaurants:[],
				restaurantsC:[],
				restaurantsI:[],
				page:{
					current:1,
					total:null
				},
				OrderIndexArr: [],
      			hoverOrderArr: [],
      			dataObj:[],//targetVoList
      			fileUpload:{   //附件上传
		          file:null
		        }
			}
		},
		computed:{
		},
		methods:{
			//导出
			exportE(){
			  var url=this.$http+'/file/exportEf?efId='+this.model.select+'&targetId='+this.model.selectI+'&efCode='+this.model.selectC;
			  window.location.href=url;
			},
			//上传相关
			httpRequest(){
			  let fd = new FormData();
			  fd.append('file', this.fileUpload.file)
			  const loading = this.$loading(this.$store.state.loading);
			  this.$CZC('/file/importEf',fd,(res)=>{
			  	loading.close();
			    if(res.code==200){
			      this.alert.text='上传成功';
			      this.alert.show=true;
			      this.alert.type='success';
			      this.curData(1);
			    }else{
			      this.alert.text=res.msg;
			      this.alert.show=true;
			      this.alert.type='error';
			    }
			  })
			},
			fileBefore (file) {
			  this.fileUpload.file=file;
			},
			fileSuccess(response, file, fileList){
			  if(response.code===200){
			    this.alert.text=response.msg
			    this.alert.show=true;
			    this.alert.type='success';
			    this.curData(1);
			  }else{
			    this.alert.text=response.msg;
			    this.alert.show=true;
			    this.alert.type='error';
			  }
			},
			//搜索框值渲染
			searchInput(){
				this.$CPOST('/evaluateForm/findAllEf',{
			    },(res)=>{
						if(res.code===200){
							let list=res.data;
								let arr=[],etc=[];
							for(let i=0;i<list.length;i++){
								arr.push({
									show:false,
									detale:false,
									number:i+1,
									name:list[i].efName,
									remarks:list[i].efCode,
									itId:list[i].efId,
									value:list[i].efName
								})
								etc.push({
									value:list[i].efCode,
									name:list[i].efName
								})
							}
							this.restaurants=arr;
							this.restaurantsC=etc;
								}
					
			    });
			    //指标渲染
			    this.$CPOST('/target/findByTargetPage',{
                    pageNum:1,
                    pageSize:10000
                },(res)=>{
                    let data=res.data.list,arr=[];
                    for(let i=0;i<data.length;i++){
                        arr.push({
                            value:data[i].targetName,
                            name:data[i].targetId
                        })
                    }
                    this.restaurantsI=arr;
                });

			},
			//单元格渲染
			curData(currentPage){
				this.tableData=[];
				const loading = this.$loading(this.$store.state.loading);
				this.$CPOST('/evaluateForm/findEvaluateFormVoPage',{
					pageNum:currentPage,
					pageSize:5
			    },(res)=>{
			    	loading.close();
			    	let list=res.data.list;
			    	let arr=[];
			    	let screen=0,noScreen=100000;
					for(let i=0;i<list.length;i++){
						screen++
						noScreen++
						let lis=list[i].targetVoList;
						if(lis.length>=1){
							for(let j=0;j<lis.length;j++){
								lis[j].screen=screen;
								arr.push({
									show:false,
									detale:false,
									number:i+1,
									name:list[i].efName,
									remark:list[i].remark,
									remarks:list[i].efCode,
									itId:list[i].efId,
									value:lis[j].efName,
									screen:screen,
									targetName:lis[j].targetName,
									targetWeight:lis[j].targetWeight,
									targetId:lis[j].targetId,
									len:lis.length
								})
							}
						}else{
							arr.push({
								show:false,
								detale:false,
								number:i+1,
								name:list[i].efName,
								remark:list[i].remark,
								remarks:list[i].efCode,
								itId:list[i].efId,
								value:list[i].efName,
								screen:noScreen
							})
						}
					}
					
					this.tableData=arr;
					this.restaurants=arr;
					this.page.total=res.data.total;
					this.getOrderNumber();
			    })

			},
			//编辑
			handleEdit(index, row) {
				this.$CPOST('/evaluateForm/findEvaluateByEfId',{
					efId:row.itId
				},(res)=>{
					if(res.code==200){
						this.$CPOST('/evaluateForm/findEvaluateFormVoPage',{
							pageNum:1,
							pageSize:5,
							efId:res.data.efId
					    },(res)=>{
					    	this.$router.push({'path':'/index/addChecklist','query':{'id':res.data.list[0]}})
					    	// this.$router.push({'path':'/index/addChecklist/id='+res.data.list[0]})
					    })
						
					}else{
						this.alert.text=res.msg;
          				this.alert.show=true;
          				this.alert.type='error';
					}
				})
	        },
	        //删除
			handleDelete(index,row){
				this.$alert('确定要删除吗？', '', {
		          confirmButtonText: '确定',
		          callback: action => {
		          	if(action=='confirm'){
		          		this.$CPOST('/evaluateForm/delEvaluateForm',{
		          			'efId':this.tableData[index].itId
		          		},(res)=>{
		          			if(res.code==200){
		          				// this.tableData.splice(index,1);
		          				this.$router.push({'path':'/index/checkList'})
		          				this.curData(1);
		          				this.searchInput();
		          				this.page.current=1;
		          			}else{
		          				this.alert.text=res.msg;
		          				this.alert.show=true;
		          				this.alert.type='error';
		          			}
		          		})
      		          }
		          }
		        })
				
			},
			add(){
				this.$router.push({path:'/index/addChecklist'});
			},
			//搜索
			searchL(){
				const loading = this.$loading(this.$store.state.loading);
				this.$CPOST('/evaluateForm/findEvaluateFormVoPage',{
					pageNum:1,
					pageSize:5,
					efId:this.model.select,
					targetId:this.model.selectI,
					efCode:this.model.selectC
			    },(res)=>{
			    	loading.close();
			    	if(res.code==200){
	    		    	let list=res.data.list;
	    		    	let arr=[];
	    		    	let screen=0,noScreen=100000;
	    				for(let i=0;i<list.length;i++){
	    					screen++
	    					noScreen++
	    					let lis=list[i].targetVoList;
	    					if(lis.length>=1){
	    						for(let j=0;j<lis.length;j++){
	    							lis[j].screen=screen;
	    							arr.push({
	    								show:false,
	    								detale:false,
	    								number:i+1,
	    								name:list[i].efName,
	    								remark:list[i].remark,
	    								remarks:list[i].efCode,
	    								itId:list[i].efId,
	    								value:lis[j].efName,
	    								screen:screen,
	    								targetName:lis[j].targetName,
	    								targetWeight:lis[j].targetWeight,
	    								targetId:lis[j].targetId,
	    								len:lis.length
	    							})
	    						}
	    					}else{
	    						arr.push({
	    							show:false,
	    							detale:false,
	    							number:i+1,
	    							name:list[i].efName,
	    							remark:list[i].remark,
	    							remarks:list[i].efCode,
	    							itId:list[i].efId,
	    							value:list[i].efName,
	    							screen:noScreen
	    						})
	    					}
	    				}
	    				this.tableData=arr;
	    				this.restaurants=arr;
	    				this.page.total=res.data.total;
	    				this.getOrderNumber();
						setTimeout(()=>{
							this.searchInput();
						},1000)
			    	}
			    	
			    })
			},
		    //分页
			currentC(page){
				this.page.current=page;
				this.curData(page);
				this.searchInput();
			},
			//合并
			getOrderNumber(){
				let OrderObj = {};
				this.OrderIndexArr=[];
				this.tableData.forEach((element, index) => {	
					element.rowIndex = index;
					if (OrderObj[element.screen]) {
		              OrderObj[element.screen].push(index) 
		            } else {
		              OrderObj[element.screen] = []
		              OrderObj[element.screen].push(index)
		            }

				})
				for (let k in OrderObj) {
		          if (OrderObj[k].length > 1) {
		            this.OrderIndexArr.push(OrderObj[k])
		          }
		        }
			},
			objectSpanMethod({ row, column, rowIndex, columnIndex }){
				if (columnIndex === 0||columnIndex === 1||columnIndex === 2||columnIndex === 5||columnIndex === 6) {
		        for (let i = 0; i < this.OrderIndexArr.length; i++) {
		            let element = this.OrderIndexArr[i];
		            for (let j = 0; j < element.length; j++) {
		              let item = element[j];
		              if (rowIndex == item) {//需要合并的行数
		                if (j == 0) {
		                  return {
		                    rowspan: element.length,//合并的行数（1234合并、56合并、78合并....)
		                    colspan: 1
		                  }
		                } else if (j != 0) {
		                  return {
		                    rowspan: 0,
		                    colspan: 0
		                  }
		                }
		              }
		            }
		          }
		        }
			},
			//指标权重转换处理
			changeNum(e){
				let cont=e.targetWeight.toString().replace(/[^0-9.]/g,'');
				if(cont>=1){
					cont.substr(0,1);
					cont=1;
				}
				this.tableData[e.rowIndex].targetWeight=cont;
			}
		}
	}
</script>
<style scoped='scoped'>
	.list-head{
		margin-bottom: 30px;
	}
	.list-head span{
		color: red;
	}
	.ipt{
		width:250px;
		margin-right: 20px;
	}
	.list-search{
		display: flex;
		margin-bottom: 30px;
	}
	.list-search .el-button{
		margin-right: 5px;
	}
	.list-search .el-select{
		margin-right: 10px;
	}
	.list-tab{
		margin-bottom: 30px;
	}
</style>