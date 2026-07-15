// ================================================
// V90 AI CORE FINAL R6
// AI成长学习模块
// ================================================

"use strict";


window.V90Learning={


weightKey:"V90_NUMBER_WEIGHTS",


recordKey:"V90_LEARNING_RECORDS",





// =================================
// 初始化权重
// =================================


init(){


let data=

localStorage.getItem(
this.weightKey
);



if(data){

return JSON.parse(data);

}






let obj={


front:{},


back:{}


};







for(
let i=1;i<=35;i++
){


obj.front[i]=1;


}





for(
let i=1;i<=12;i++
){


obj.back[i]=1;


}







this.save(obj);



return obj;



},







// =================================
// 保存权重
// =================================


save(data){



localStorage.setItem(

this.weightKey,

JSON.stringify(data)

);



},







// =================================
// 获取记录
// =================================


records(){



return JSON.parse(

localStorage.getItem(

this.recordKey

)

||

"[]"

);



},







// =================================
// 保存学习记录
// =================================


saveRecord(data){



let arr=

this.records();



arr.push(data);






localStorage.setItem(

this.recordKey,

JSON.stringify(arr)

);



},







// =================================
// 开奖反馈学习
// =================================


learn(pred,real){



let weight=

this.init();






let frontHit=[];


let backHit=[];







// 前区学习


pred.front.forEach(n=>{



if(
real.front.includes(n)
){



weight.front[n]+=0.05;


frontHit.push(n);



}else{



weight.front[n]-=0.01;



}






});








// 后区学习


pred.back.forEach(n=>{



if(
real.back.includes(n)
){



weight.back[n]+=0.08;


backHit.push(n);



}else{



weight.back[n]-=0.02;



}



});








// 防止负数


Object.keys(weight.front)

.forEach(n=>{



if(weight.front[n]<0.1)

weight.front[n]=0.1;



});







Object.keys(weight.back)

.forEach(n=>{



if(weight.back[n]<0.1)

weight.back[n]=0.1;



});









this.save(weight);









this.saveRecord({



time:

new Date()
.toLocaleString(),



prediction:pred,



result:real,



hit:{



front:frontHit,


back:backHit



}



});









return {



frontHit,



backHit



};



},







// =================================
// 成长统计
// =================================


stats(){



let list=

this.records();






return {



count:

list.length,



last:

list[list.length-1]



};



}






};