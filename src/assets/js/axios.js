import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
import token from './token.js'
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
//interceptors拦截器
axios.interceptors.request.use(
  config => {
  	if(token==null){
  		location.reload();
  	}else{
  		config.headers.token = token;
  	}
    return config;
  },
  err => {
    return Promise.reject(err);
});
//axiosGET请求
Vue.prototype.$CGET = (url,arg,success,error) =>{
	axios.get('/api/emc'+url,{
				params:arg
			})
	.then(res => {
	   const data = res.data;
	    	if(typeof success === 'function'){
				    success(data);
	       }
	})
	.catch(error => {
      if(typeof error === 'function'){
     	  erro(data)
      }
    })
}
//上传请求
Vue.prototype.$CZC=(url,arg,success,error)=>{
	axios.post('/api/emc'+url,arg,{
		headers:{
			token:token
		}
	})
	.then(res => {
	   const data = res.data;
    	if(typeof success === 'function'){
			    success(data);
       }
	})
}
//axiosPOST请求
Vue.prototype.$CPOST=(url,arg,success,error)=>{
	axios.post('/api/emc'+url,qs.stringify(arg),{
		headers:{
			token:token
		}
	})
	.then(res => {
	   const data = res.data;
	   // if(data.code != 200){
	   // 		//loding
	   // 		success(data);
	   //  }else{
	    	if(typeof success === 'function'){
				    success(data);
	       }
	    // }
	})
	.catch(error => {
      if(typeof error === 'function'){
     	  erro(data)
      }
   })
}
//umcPost
Vue.prototype.$UPOST=(url,arg,success,error)=>{
	axios.post(url,qs.stringify(arg),{
		headers:{
			token:token,
			// 'Content-Type': 'application/json'
		}
	})
	.then(res => {
	   const data = res.data;
	   // if(data.code != 200){
	   // 		//loding
	   // 		success(data);
	   //  }else{
	    	if(typeof success === 'function'){
				    success(data);
	       }
	    // }
	})
	.catch(error => {
      if(typeof error === 'function'){
     	  erro(data)
      }
   })
};

Vue.prototype.$JSON = (method, url, arg, success, cerror) => {
	axios[method](url, qs.stringify(arg), {
		headers: {
			token: token,
			'Content-Type': 'application/json'
		}
	}).then(res => {
		const data = res.data;
		if (typeof success === 'function') {
				success(data);
		}
	}).catch(error => {
		if(typeof cerror === 'function') {
			cerror(error);
	 }
	});
};