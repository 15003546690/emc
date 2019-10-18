import Vue from 'vue';
import { Base64 } from 'js-base64';// console.log(Base64.decode(getCookie('id')))//目前获取地址栏的id，会覆盖统一登录的id，将来如果改需求，用此方法
//VUE取地址栏参数
function getUrlKey(name){
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}
//token系列
function getCookie(name){
	let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
}
if(getUrlKey('menuId')!=null){
	document.cookie="zctoken="+getUrlKey('token');//本地开发需打开
	document.cookie="zcid="+getUrlKey('id');
	document.cookie="menuId="+getUrlKey('menuId');
}
Vue.prototype.$zcId=getCookie('zcid');
Vue.prototype.$menuId=getCookie('menuId');
Vue.prototype.$DelCookie=(name)=>{
	let exp = new Date();
	exp.setTime(exp.getTime() - 1);
	let cval=getCookie(name);
	if(cval!=null)
	document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
let token;
let host=window.location.hostname;
if(window.location.port=='8081'){//本地开发环境
	token=getCookie('zctoken');
	Vue.prototype.$Token=getCookie('zctoken');
}else{//本地以外的环境
	token=getCookie('token');
	Vue.prototype.$Token=getCookie('token');
}
if(token==null){
	if(host=="192.168.112.210"){//测试
		window.location.href='https://192.168.112.210:9007/#/login';
	}else if(host=="192.168.112.168"){//正式内网
		window.location.href='https://58.30.9.142:48082/#/login';
	}else if(host=="58.30.9.142"){//正式外网
		window.location.href='https://58.30.9.142:48082/#/login';
	}else{
		window.location.href='https://192.168.112.210:9007/#/login';
	}
}else{
	if(host=="192.168.112.210"){//测试
		Vue.prototype.$http = 'http://192.168.112.210:8092/emc';//导出
	}else if(host=="192.168.112.168"){//正式内网
		Vue.prototype.$http='http://192.168.112.168:8092/emc';//导出
	}else if(host=="58.30.9.142"){//正式外网
		Vue.prototype.$http='http://192.168.112.168:8092/emc';//导出
	}else{
		Vue.prototype.$http = 'http://192.168.112.210:8092/emc';//导出
	}
}
export default token