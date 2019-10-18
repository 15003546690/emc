<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created(){
  	if(this.$Token!=null){
  		let str=window.location.href;
  		window.location.href=str.replace(/\?.*/g,"");
  	}
  }
};
</script>

<style>
	.zc-btn{
	    cursor: pointer;
	    float: left;
	    margin-right: 10px;
	    font-size: 20px;
	    color: #409EFF;
	  }
	.is-active{
		color: rgb(64, 158, 255) !important;
	}
	a:-webkit-any-link{
		color:rgb(48, 49, 51);
	}
</style>
