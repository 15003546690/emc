<template>
	<div class="my-relation">
		<mt-header fixed :title=title>
			<router-link to="/index/my" slot="left" style='color: #fff;'>
			    <mt-button icon="back">返回</mt-button>
			  </router-link>
		</mt-header>
		<div class='myR-search'>
			<el-select v-model="evVal" placeholder="请选择考评" filterable clearable>
              <el-option
                v-for="(i,index) in evList"
                :key='index'
                :label="i.name"
                :value="i.id">
              </el-option>
            </el-select>
            <!-- 被考评项 -->
            <el-select v-model="model.coverName" placeholder="请输入被考评项" filterable clearable>
              <el-option
                v-for="(j,index) in info.coverName"
                :key='index'
                :label="j.value"
                :value="j.id">
              </el-option>
            </el-select>
            <!-- 考评人 -->
            <el-select v-model="model.examiner" placeholder="请输入考核人" filterable clearable>
              <el-option
                v-for="(item,index) in info.examiner"
                :key='index'
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button type='primary' @click='searchL()'>搜索</el-button>
		</div>
		<div class="reation-table">
			<el-tabs type="border-card" v-model="activeName" @tab-click="tabCk">
			  <el-tab-pane label="我的下属">
					<el-table
					    :data="tableData"
					    :span-method="objectSpanMethod"
					    border
					    style="width: 100%">
					    <el-table-column
					      prop="eiName"
					      label="考评关系名称">
					      <template slot-scope="scope">
					      	<span>{{scope.row.rsName}}</span>
					      </template>
					    </el-table-column>
					    <el-table-column
					      prop="eiName"
					      label="被考评人">
					      <template slot-scope="scope">
					      	<span>{{scope.row.eiName}}</span>
					      </template>
					    </el-table-column>
					    <el-table-column
					      prop="efName"
					      label="考核表">
					      <template slot-scope="scope">
					      <span>{{scope.row.efName}}</span>
					      </template>
					    </el-table-column>
					    <el-table-column
					      prop="epName"
					      label="考评人">
					      <template slot-scope="scope">
					      	<span>{{scope.row.epName}}</span>
					      </template>
					    </el-table-column>
					</el-table>
			  </el-tab-pane>
			  <el-tab-pane label="我的领导">
					<el-table
					    :data="tableData"
					    :span-method="objectSpanMethods"
					    border
					    style="width: 100%">
					    <el-table-column
					      prop="eiName"
					      label="考评关系名称">
					      <template slot-scope="scope">
					      	<span>{{scope.row.rsName}}</span>
					      </template>
					    </el-table-column>
					    <el-table-column
					      prop="eiName"
					      label="被考评人">
					      <template slot-scope="scope">
					      	<span>{{scope.row.eiName}}</span>
					      </template>
					    </el-table-column>
					    <el-table-column
					      prop="efName"
					      label="考核表">
					      <template slot-scope="scope">
					      <span>{{scope.row.efName}}</span>
					      </template>
					    </el-table-column>
					    <el-table-column
					      prop="epName"
					      label="考评人">
					      <template slot-scope="scope">
					      	<span>{{scope.row.epName}}</span>
					      </template>
					    </el-table-column>
					</el-table>
			  </el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
	export default{
		created(){
			this.currentData();
			this.currentTable();
		},
		data(){
			return{
				loading: false,
				title:'评分关系',
				userId:'',
				model:{
					coverName:'',
					examiner:''
				},
				info:{
					coverName:[],
					examiner:[]
				},
				activeName:'',
				name:'',
				evList:[],
				evVal:'',
				tableData:[]
			}
		},
		methods:{
			tabCk(){
				this.currentTable(this.evVal,this.model.coverName,this.model.examiner);
			},
			currentData(){
			  this.$UPOST('/api/umc/user/findUserByUserId',{
		          userId:this.$zcId,
		          menuId:this.$menuId
		      },(res)=>{
		        this.userId=res.data.userId;
		      })
				//考核人渲染
              this.$UPOST('/api/umc/user/findUserAll',{
                  pageNo:1,
                  pageSize:1000000
              },(res)=>{
                let data=res.data.list;
                for(let i=0;i<data.length;i++){
                  this.info.examiner.push({
                    value:data[i].userName,
                    id:data[i].userId
                  })
                }
              })
              //被考核项渲染
              this.$CPOST('/evaluateItem/findAll',{
              },(res)=>{
                let data=res.data;
                for(let i=0;i<data.length;i++){
                  this.info.coverName.push({
                    value:data[i].eiName,
                    id:data[i].eiId
                  })
                }
              });
				this.$CPOST('/evaluate/findAllEvaluate',{
				},(res)=>{
				  const data=res.data.list;
				  for(let i=0;i<data.length;i++){
				    this.evList.push({
				      id:data[i].evId,
				      name:data[i].evName
				    })
				  }
				});
				//人
				this.$UPOST('/api/umc/user/findUserByUserId',{
				  userId:this.$zcId,
				  menuId:this.$menuId
				},(res)=>{
				  this.name = res.data.userName;
				})
			},
			searchL(){
				this.currentTable(this.evVal,this.model.coverName,this.model.examiner);
			},
			currentTable(evId,eiId,evPeopleId){
				const loading = this.$loading(this.$store.state.loading);
				this.tableData=[];
				this.$CPOST('/relation/findMyRelationship',{
					evId,
					eiId,
					evPeopleId
				},(res)=>{
					loading.close();
					let data,screen=0;
					if(this.activeName==0){
						data=res.data.myUnderRelationship;
					}else{
						data=res.data.myRelationship;
					}
	                for(let i=0;i<data.length;i++){
	                  let eiData=data[i].eiVoList;
	                  for(let j=0;j<eiData.length;j++){
	                    let dfData=eiData[j].efAndWeightVoList;
	                    for(let z=0;z<dfData.length;z++){
	                      screen++
	                      this.mergeLen=dfData[z].epAndWeightVoList.length;
	                      let evData=dfData[z].epAndWeightVoList;
	                      for(let c=0;c<evData.length;c++){
	                        this.tableData.push({
	                          rsId:data[i].rsId,
	                          rsName:data[i].rsName,
	                          screen:screen,
	                          eiName:eiData[j].eiName,//被考核项名称
	                          eiId:eiData[j].eiId,
	                          eiCode:eiData[j].eiCode,//被考核项编号
	                          efName:dfData[z].efName,//考核表
	                          efId:dfData[z].efId,
	                          efWeight:dfData[z].efWeight,//考核表权重
	                          epName:evData[c].evaluationPeopleName,//考评人
	                          epId:evData[c].evaluationPeopleId,
	                          epWeight:evData[c].userWeight,//考评人权重
	                          epCode:evData[c].evaluationPeopleCode
	                        })
	                      }
	                    }
	                  }
	                }

				})
				// this.evVal='';
			},
			//合并
			mergeComon(id,rowIndex){
                var idName=this.tableData[rowIndex][id];
                if(rowIndex>0){
                  if(this.tableData[rowIndex][id] != this.tableData[rowIndex-1][id]){
                    var i = rowIndex,num = 0;
                    while(i<this.tableData.length){
                      if(this.tableData[i][id] === idName){
                        i++;
                        num++;
                      }else{
                        i=this.tableData.length
                      }
                    }
                    return {
                      rowspan:num,
                      colspan:1
                    }
                  }else{
                    return{
                      rowspan:0,
                      colspan:1
                    }
                  }
                }else{
                  var i = rowIndex,num = 0;
                  while(i<this.tableData.length){
                    if(this.tableData[i][id] === idName){
                      i++;
                      num++;
                    }else{
                      i=this.tableData.length
                    }
                  }
                  return {
                    rowspan:num,
                    colspan:1
                  }
                }
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }){
              switch(columnIndex){
              	  case 0:
              	  return this.mergeComon('rsId',rowIndex);
                  case 1:
                  return this.mergeComon('eiId',rowIndex);
                  break;
                  case 2:
                  return this.mergeComon('screen',rowIndex);
                }
            },
            objectSpanMethods({ row, column, rowIndex, columnIndex }){
            	if(this.userId==1){
	            	// admin
		            switch(columnIndex){
	              	  case 0:
	              	  return this.mergeComon('rsId',rowIndex);
	                  case 1:
	                  return this.mergeComon('eiId',rowIndex);
	                  break;
	                  case 2:
	                  return this.mergeComon('screen',rowIndex);
	                }
            	}else{
            		switch(columnIndex){
            			  case 0:
            		    case 1:
            		    return this.mergeComon('rsId',rowIndex);
            		    break;
            		    case 2:
            		    return this.mergeComon('screen',rowIndex);
            		  }
            	}
            	
              
            }
		}
	}
</script>
<style scoped='scoped'>
	.mint-header.is-fixed{
		z-index: 999 !important;
	}
	.mint-header button{
		color: #fff;
		
	}
	.myR-search{
		padding: 0 10px 0 10px;
		margin-bottom: 20px;
	}
	.myR-search .el-select,.ev-search button{
		width: 100%;
		margin-top: 10px;
		margin-left: 0 !important;
	}
	.myR-search button{
		width: 100%;
		margin-top: 10px;
	}
</style>
