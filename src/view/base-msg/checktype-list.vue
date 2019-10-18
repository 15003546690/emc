<template>
	<div>
		<h2 class="list-head">考评项目列表,共<span>{{page.total}}</span>条</h2>
		<div class="list-content">
			<div class='list-search'>
				<el-select v-model="search" placeholder="请输入KPI名称" filterable clearable>
					<el-option
					  v-for="item in restaurants"
					  :key="item.name"
					  :label="item.name"
					  :value="item.name">
					</el-option>
				</el-select>
				<el-button type="primary" @click='searchL()'>搜索</el-button>
			</div>
			<div class='list-tab'>
				<el-table
				    :data="tableData"
				    border>
				    <el-table-column
				      prop="number"
				      label="序号"
				      width="50">
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="考评类型名称">
				      <template slot-scope="scope">
				      	<el-input v-if='scope.row.show' v-model='scope.row.name'></el-input>
				      	<span v-else>{{scope.row.name}}</span>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="remarks"
				      label="备注">
				      <template slot-scope="scope">
				      	<el-input v-if='scope.row.show' v-model='scope.row.remarks'></el-input>
				      	<span v-else>{{scope.row.remarks}}</span>
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
		<div class="add-target">
			<el-tag>考评类型新增</el-tag>
			<div class="addT-content">
				<el-table
				    :data="addData"
				    style="width: 100%">
				    <el-table-column
				      prop="name"
				      label="考评类型名称">
				      <template slot-scope="scope">
				      	<el-input rows=1 resize='none' type='textarea' v-model='scope.row.name' placeholder="请输入考评类型名称"></el-input>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="remark"
				      label="备注">
				      <template slot-scope="scope">
				      	<el-input rows=1 resize='none' type='textarea' v-model='scope.row.remark' placeholder="请输入备注" class='zzz'></el-input>
				      </template>
				    </el-table-column>
				    <el-table-column
				      label="操作"
					  width=100
				      >
				      	<template slot-scope="scope">
				      		<div class="iconfont icon-baocun zc-btn" @click="save(scope.row)"></div>
				      		<div class="iconfont icon-qingchu zc-btn" @click="clear(scope.row)"></div>
				      	</template>
				    </el-table-column>
				  </el-table>
			</div>
		</div>
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
			setTimeout(()=>{
				this.searchInput();
			},1000)
		},
		data(){
			return{
				addData:[
					{
						name:'',
						remark:'',
					}
				],
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
				search:'',
				tableData: [],
				restaurants:[],
				page:{
					current:1,
					total:null
				}
			}
		},
		methods:{
			aAalert(text,status){
			    this.alert.text=text;
			    this.alert.show=true;
			    this.alert.type=status;
			},
			clear(val){
				let data=this.addData[0];
				data.name='';
				data.remark='';
				data.standard='';
				data.method='';
			},
			save(val){
				let data=this.addData[0];
				if(val.name==''){
                    this.aAalert('请输入KPI名称','error');
                }else{
                    this.$CPOST('/evaluateType/addEvaluateType',{
                        etName:val.name,
                        remark:val.remark,
                    },(res)=>{
                        if(res.code==200){
                            data.name='';
                            data.remark='';
                            this.aAalert('保存成功','success')
                            this.curData(1);
                        }else if(res.code!=200){
                            this.aAalert(res.msg,'error')
                        }
                    })
                }
			},
			searchInput(){
				this.$CPOST('/evaluateType/findAllEvaluateType',{
					pageNum:1,
					pageSize:10000000
			    },(res)=>{
			    	let list=res.data.list;
			    	let arr=[];
					for(let i=0;i<list.length;i++){
						arr.push({
							show:false,
							detale:false,
							number:i+1,
							name:list[i].etName,
							remarks:list[i].remark,
							etId:list[i].etId,
							key:'编辑',
							value:list[i].etName
						})
					}
					this.restaurants=arr;
			    })
			},
			curData(currentPage){
				const loading = this.$loading(this.$store.state.loading);
				this.$CPOST('/evaluateType/findAllEvaluateType',{
					pageNum:currentPage,
					pageSize:5
			    },(res)=>{
			    	loading.close();
			    	let list=res.data.list;
			    	let arr=[];
					for(let i=0;i<list.length;i++){
						arr.push({
							show:false,
							detale:false,
							number:i+1,
							name:list[i].etName,
							remarks:list[i].remark,
							etId:list[i].etId,
							key:'编辑',
							value:list[i].etName
						})
					}
					this.tableData=arr;
					this.restaurants=arr;
					this.page.total=res.data.total;
			    })
			    // .then((res)=>{
			    //   let list=res.data.data;
			    //   let arr=[];
			    //   for(let i=0;i<list.length;i++){
			    //   	arr.push({
			    //   		show:false,
			    //   		number:i+1,
			    //   		name:list[i].etName,
			    //   		remarks:list[i].remark,
			    //   		etId:list[i].etId,
			    //   		key:'编辑'
			    //   	})
			    //   }
			    //   this.tableData=arr;
			    //   console.log(arr)
			    //   console.log(this.tableData)
			    // })
			},
			handleEdit(index, row) {
				if(!this.tableData[index].show){
					this.tableData[index].show=true;
	        		this.tableData[index].key='保存';
				}else{
					this.tableData[index].show=false;
	        		this.tableData[index].key='编辑';
	        		this.$CPOST('/evaluateType/updateEvaluateType',{
	        			'etId':this.tableData[index].etId,
	        			'etName':this.tableData[index].name,
	        			'remark':this.tableData[index].remarks
			    	},(res)=>{
			    		if(res.code!=200){
			    			this.alert.text=res.msg;
	          				this.alert.show=true;
	          				this.alert.type='error';
			    		}
			    	})
				}
	        	
	        },
			handleDelete(index,row){
				this.$alert('确定要删除吗？', '', {
		          confirmButtonText: '确定',
		          callback: action => {
		          	if(action=='confirm'){
      		          	this.$CPOST('/evaluateType/delEvaluateType',{
      						'etId':this.tableData[index].etId
      					},(res)=>{
      						if(res.code==200){
      							this.tableData.splice(index,1);
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
				this.$router.push({path:'/index/addChecktype'});
			},
			searchL(){
				const loading = this.$loading(this.$store.state.loading);
				this.$CPOST('/evaluateType/findAllEvaluateType',{
					pageNum:1,
					pageSize:5,
					etName:this.search
			    },(res)=>{
			    	loading.close();
			    	if(res.code==200){
			    		let list=res.data.list;
				    	let arr=[];
						for(let i=0;i<list.length;i++){
							arr.push({
								show:false,
								detale:false,
								number:i+1,
								name:list[i].etName,
								remarks:list[i].remark,
								etId:list[i].etId,
								key:'编辑',
								value:list[i].etName
							})
						}
						this.tableData=arr;
						// this.search='';
						this.page.total=res.data.total;
			    	}
			    	
			    })
			},
		    //分页
			currentC(page){
				this.page.current=page;
				this.curData(page);
				this.searchInput();
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
		margin-bottom: 30px;
	}
	.list-tab{
		margin-bottom: 30px;
	}
	/*新增*/
	.add-target{
		margin-top: 20px;
		background: #f5f7fa;
	}
	.el-tag{
		width: 100%;
		border: none;
		border-radius: 0;
		font-size: 14px;
	}
	.addT-content{
		padding: 20px;
		border-top: 1px solid #f5f5f5;
	}
</style>