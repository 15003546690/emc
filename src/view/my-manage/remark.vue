<template>
	<div class="remark">
		<div class="remark-search">
			<el-select v-model="evVal" placeholder="请选择考评" filterable clearable>
              <el-option
                v-for="(i,index) in evList"
                :key='index'
                :label="i.name"
                :value="i.id">
              </el-option>
            </el-select>
            <el-select v-model="personVal" placeholder="请选择考评人" filterable clearable>
              <el-option
                v-for="(item,index) in person"
                :key='index'
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button type='primary' @click='searchL()'>搜索</el-button>
		</div>
		<div class="remark-content">
			<el-table
			    :data="tableData"
			    border>
			    <el-table-column
			      prop="name"
			      label="考评名称">
			      <template slot-scope="scope">
			      	<span>{{scope.row.name}}</span>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="man"
			      label="考评人">
			      <template slot-scope="scope">
			      	<span>{{scope.row.man}}</span>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="remark"
			      label="评语">
			      <template slot-scope="scope">
			      	<span>{{scope.row.remark}}</span>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="date"
			      label="日期">
			      <template slot-scope="scope">
			      	<span>{{scope.row.date}}</span>
			      </template>
			    </el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
	export default{
		created(){
			this.currentData();
			this.searchL();
		},
		data(){
			return{
				tableData:[],
				evVal:'',
				evList:[],
				person:[],
				personVal:''
			}
		},
		methods:{
			currentData(){
				//考评名称
				this.$CPOST('/evaluate/findAboutMeEvaluate',{
				},(res)=>{
					const data = res.data.list;
					if (data && Array.isArray(data) && data.length) {
						for (let i = 0; i < data.length; i++) {
							this.evList.push({
								id:data[i].evId,
								name:data[i].evName
							});
						}
						this.evVal = data[0].evId;
					} else {
						this.evList = [];
					}
				});
				//考评人渲染
				this.$UPOST('/api/umc/user/findUserAll',{
				  pageNo:1,
				  pageSize:1000000
				},(res)=>{
				let data=res.data.list;
				for(let i=0;i<data.length;i++){
				  this.person.push({
				    value:data[i].userName,
				    id:data[i].userId
				  })
				}
				})
			},
			searchL(){
				const loading = this.$loading(this.$store.state.loading);
				this.tableData=[];
				this.$CPOST('/comment/findMyComment',{
					evId:this.evVal,
					evaluationPeopleId:this.personVal
				},(res)=>{
					loading.close();
					const data=res.data;
					for(let i=0;i<data.length;i++){
						this.tableData.push({
							name:data[i].evName,
							man:data[i].evaluationPeopleName,
							remark:data[i].comment,
							date:data[i].commentTime
						})
					}
				})
			}
		}
	}
</script>
<style scoped='scoped'>
	.remark-search{
		margin-bottom: 30px;
	}
	.remark-search .el-select{
		margin-right: 10px;
	}
</style>
