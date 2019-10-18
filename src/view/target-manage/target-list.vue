<template>
	<div class="target-list">
		<h2 class="list-head">KPI列表,共<span>{{page.total}}</span>条</h2>
		<div class="list-content">
			<div class='list-search'>
        <el-input placeholder='请输入KPI名称' v-model='targetName' class="inpute"></el-input>
				<!--<el-select v-model="searchName" placeholder="请输入KPI名称" filterable clearable>-->
					<!--<el-option-->
					  <!--v-for="(item,index) in restaurants"-->
					  <!--:key="index"-->
					  <!--:label="item.name"-->
					  <!--:value="item.name">-->
					<!--</el-option>-->
				<!--</el-select>-->
				<!-- <el-select v-model="codeName" placeholder="请输入KPI编码" filterable clearable>
					<el-option
					  v-for="(item,index) in restaurants"
					  :key="index"
					  :label="item.value"
					  :value="item.value">
					</el-option>
				</el-select> -->
				<el-button type="primary" @click='searchL("s")'>搜索</el-button>
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
				      label="KPI名称"
				      width="150">
				      <template slot-scope="scope">
				      	<el-input v-if='scope.row.show' rows=1 resize='none' type='textarea' v-model='scope.row.name' placeholder="请输入KPI名称"></el-input>
				      	<span v-else>{{scope.row.name}}</span>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="standard"
				      label="绩效标准">
				      <template slot-scope="scope">
				      	<el-input v-if='scope.row.show' rows=1 resize='none' type='textarea' v-model='scope.row.standard' placeholder="请输入KPI名称"></el-input>
				      	<span v-else>{{scope.row.standard}}</span>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="score"
				      label="评分方法">
				      <template slot-scope="scope">
				      	<el-input v-if='scope.row.show' rows=1 resize='none' type='textarea' v-model='scope.row.score' placeholder="请输入KPI名称"></el-input>
				      	<span v-else>{{scope.row.score}}</span>
				      </template>
				    </el-table-column>
						<el-table-column
				      prop="remarks"
				      label="备注"
				      width="120">
				      <template slot-scope="scope">
				      	<el-input v-if='scope.row.show' rows=1 resize='none' type='textarea' v-model='scope.row.remarks' placeholder="请输入KPI名称"></el-input>
				      	<span v-else>{{scope.row.remarks}}</span>
				      </template>
				    </el-table-column>
				    <el-table-column label="操作" width="90">
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
			<el-tag>KPI新增</el-tag>
			<div class="addT-content">
				<el-table
				    :data="addData"
				    style="width: 100%">
				    <el-table-column
				      prop="name"
				      label="KPI名称">
				      <template slot-scope="scope">
				      	<el-input rows=2 resize='none' type='textarea' v-model='scope.row.name' placeholder="请输入KPI名称"></el-input>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="standard"
				      label="绩效标准">
				      <template slot-scope="scope">
				    		<el-input rows=2 resize='none' type='textarea' v-model='scope.row.standard' placeholder="请输入绩效标准"></el-input>
				    	</template>
				    </el-table-column>
				    <el-table-column
				      prop="method"
				      label="评分方法">
				      	<template slot-scope="scope">
				      		<el-input rows=2 resize='none' type='textarea' v-model='scope.row.method' placeholder="请输入评分方法"></el-input>
				      	</template>
				    </el-table-column>
				    <el-table-column
				      prop="remark"
				      label="备注">
				      <template slot-scope="scope">
				      	<el-input rows=2 resize='none' type='textarea' v-model='scope.row.remark' placeholder="请输入备注" class='zzz'></el-input>
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
			// this.searchInput();
		},
		data(){
			return{
				addData:[
					{
						name:'',
						remark:'',
						standard:'',
						method:''
					}
				],
				alert:{
					text:'保存成功',//提示的文字
					show:false,//显示隐藏
					type:'success'//显示类型
				},
				search:'',
				searchName:'',
        targetName:'',
				//codeName:'',
				restaurants:[],//kpi名称
				tableData: [],
				handleSelect:[],
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
			//清除
			clear(val){
				let data=this.addData[0];
				data.name='';
				data.remark='';
				data.standard='';
				data.method='';
			},
			//单元格操作修改保存
			save(val){
				let data=this.addData[0];
				if(val.name==''){
                    this.aAalert('请输入KPI名称','error');
                }else{
                    this.$CPOST('/target/addTarget',{
                        targetName:val.name,
                        remark:val.remark,
                        var1:val.standard,
                        var2:val.method
                    },(res)=>{
                        if(res.code==200){
                            data.name='';
                            data.remark='';
                            data.standard='';
                            data.method='';
                            this.aAalert('保存成功','success')
                            this.curData(1);
                        }else if(res.code!=200){
                            this.aAalert(res.msg,'error')
                        }
                    })
                }
			},
			//渲染搜索项
			searchInput(){
				this.$CGET('/target/findByTargetPage',{
			    },(res)=>{
			    	let list=res.data.list;
			    	let etc=[];
			    	for(let i=0;i<list.length;i++){
						etc.push({
							value:list[i].targetCode,
							name:list[i].targetName
						})
					}
					this.restaurants=etc;
					this.page.total=res.data.total;
			    })
			},
			//单元格渲染
			curData(currentPage){
				const loading = this.$loading(this.$store.state.loading);
				this.$CGET('/target/findByTargetPage',{
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
							code:list[i].targetCode,
							name:list[i].targetName,
							remarks:list[i].remark,
							etId:list[i].targetId,
							standard:list[i].var1,
							score:list[i].var2,
							key:'编辑',
							value:list[i].targetName
						})
					}
					this.tableData=arr;
					this.page.total=res.data.total;
			    })
			},
			//单元格修改
			handleEdit(index, row) {
				if(!this.tableData[index].show){
					this.tableData[index].show=true;
	        		this.tableData[index].key='保存';
				}else{
					this.tableData[index].show=false;
	        		this.tableData[index].key='编辑';
	        		this.$CPOST('/target/updateByTargetId',{
	        			'targetId':this.tableData[index].etId,
	        			'targetName':this.tableData[index].name,
	        			'targetCode':this.tableData[index].code,
	        			'remark':this.tableData[index].remarks,
	        			'var1':this.tableData[index].standard,
	        			'var2':this.tableData[index].score
			    	},(res)=>{
			    		if(res.code!=200){
			    			alert('数据发生变化');
			    		}
			    	})
				}

	        },
	        //删除
			handleDelete(index,row){
				this.$alert('确定要删除吗？', '', {
			          confirmButtonText: '确定',
			          callback: action => {
			          	if(action=='confirm'){
			          		this.$CGET('/target/delTarget',{
			          			'targetId':this.tableData[index].etId
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
			//添加
			add(){
				this.$router.push({path:'/index/AddTarget'});
			},
			//搜索
			searchL(_d){
				if(_d=='s'){
					this.page.current=1;
				}
				const loading = this.$loading(this.$store.state.loading);
				this.$CGET('/target/findByTargetPage',{
					pageNum:this.page.current,
					pageSize:5,
					// targetCode:this.codeName,
					targetName:this.targetName
			    },(res)=>{
			    	if(res.code==200){
			    		loading.close();
			    		let list=res.data.list;
				    	let arr=[];
						for(let i=0;i<list.length;i++){
							arr.push({
								show:false,
								detale:false,
								number:i+1,
								code:list[i].targetCode,
								name:list[i].targetName,
								remarks:list[i].remark,
								etId:list[i].targetId,
								standard:list[i].var1,
								score:list[i].var2,
								key:'编辑',
								value:list[i].targetName
							})
						}
						this.tableData=arr;
						this.page.total=res.data.total;
						// this.searchName='';
						// this.codeName='';
			    	}

			    })
			},
			//分页
			currentC(page){
				this.page.current=page;
				this.searchL();
				// this.curData(page);
				// this.searchInput();
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
  >>>.inpute{
    width: 15% ;
  }
</style>
