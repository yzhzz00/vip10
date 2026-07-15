// ================================================
// V90 AI CORE FINAL R7.0
// AI训练学习权重中心
// ================================================

"use strict";


window.V90Learning={


key:"V90_R7_MODEL_WEIGHT",







// =================================
// 初始化
// =================================


init(){



let data=

localStorage.getItem(
this.key
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
// 保存
// =================================


save(data){



localStorage.setItem(

this.key,

JSON.stringify(data)

);



},







// =================================
// 限制范围
// =================================


limit(v){



if(v<0.5)

return 0.5;




if(v>3)

return 3;






return Number(

v.toFixed(3)

);



},







// =================================
// 根据训练结果学习
// =================================


train(records){



let weight=

this.init();







records.forEach(item=>{



let pred=

item.predict;



let real=

item.real;







// 前区学习


pred.front.forEach(n=>{



if(
real.front.includes(n)
){



weight.front[n]=

this.limit(

weight.front[n]+0.01

);



}else{



weight.front[n]=

this.limit(

weight.front[n]-0.003

);



}



});








// 后区学习


pred.back.forEach(n=>{



if(
real.back.includes(n)
){



weight.back[n]=

this.limit(

weight.back[n]+0.015

);



}else{



weight.back[n]=

this.limit(

weight.back[n]-0.005

);



}



});








});








this.save(weight);






return weight;



},







// =================================
// 获取权重
// =================================


get(){



return this.init();



},







// =================================
// 重置学习
// =================================


reset(){



localStorage.removeItem(

this.key

);



return this.init();



}






};