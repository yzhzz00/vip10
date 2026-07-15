// ================================================
// V90 AI CORE FINAL R6.1
// AI成长学习系统
// ================================================

"use strict";


window.V90Learning={



weightKey:"V90_R61_WEIGHTS",


recordKey:"V90_R61_LEARNING_RECORD",







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
let i=1;

i<=35;

i++

){



obj.front[i]=1;



}







for(
let i=1;

i<=12;

i++

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
// 学习记录
// =================================


getRecords(){



return JSON.parse(

localStorage.getItem(

this.recordKey

)

||

"[]"

);



},







saveRecord(data){



let list=

this.getRecords();






list.push(data);






// 只保存最近500次


if(
list.length>500
){



list=list.slice(
-500
);



}







localStorage.setItem(

this.recordKey,

JSON.stringify(list)

);



},







// =================================
// 限制权重范围
// =================================


limit(value){



if(value<0.2)

return 0.2;



if(value>5)

return 5;



return Number(

value.toFixed(3)

);



},







// =================================
// 开奖学习
// =================================


learn(pred,real){



let weight=

this.init();






let frontHit=[];

let backHit=[];







// 前区


pred.front.forEach(n=>{



if(
real.front.includes(n)
){



weight.front[n]=

this.limit(

weight.front[n]+0.05

);



frontHit.push(n);



}else{



weight.front[n]=

this.limit(

weight.front[n]-0.015

);



}



});









// 后区加强


pred.back.forEach(n=>{



if(
real.back.includes(n)
){



weight.back[n]=

this.limit(

weight.back[n]+0.08

);



backHit.push(n);



}else{



weight.back[n]=

this.limit(

weight.back[n]-0.02

);



}



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

this.getRecords();






return {



count:list.length,



last:

list[list.length-1]



};



},







// =================================
// 查看数字权重
// =================================


getWeight(){



return this.init();



}





};