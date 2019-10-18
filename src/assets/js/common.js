import Vue from 'vue';
//去重
Vue.prototype.$Duplicates=(arr)=>{
	let result = [];
    arr.forEach(item => {
        if (arr.indexOf(item) !== arr.lastIndexOf(item) && result.indexOf(item) == -1) {
            result.push(item);
        }
    })
    return result
}