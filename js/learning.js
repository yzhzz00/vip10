// ================================================
// V90 AI CORE R5
// 数字学习引擎
// ================================================

"use strict";


window.V90Learning={


recordKey:"V90_AI_LEARNING",

weightKey:"V90_NUMBER_WEIGHT",






// 初始化权重

init(){


let data=

localStorage.getItem(
this.weightKey
);




if(data)

return JSON.parse(data);







let weight={



front:{},

back:{}



};






for(
let i=1;i<=35;i++
){



weight.front[i]=1;



}







for(
let i=1;i<=12;i++
){



weight.back[i]=1;



}







this.saveWeight(weight);



return weight;



},







// 获取权重


getWeight(){



return this.init();



},







// 保存权重


saveWeight(data){



localStorage.setItem(

this.weightKey,

JSON.stringify(data)

);



},







// ================================
// 开奖学习
// ================================


learn(pred,real){



let weight=

this.getWeight();





let hitFront=[];

let hitBack=[];







pred.front.forEach(n=>{



if(
real.front.includes(n)
){



hitFront.push(n);



}else{



weight.front[n]-=0.01;



}



});








pred.back.forEach(n=>{



if(
real.back.includes(n)
){



hitBack.push(n);



}else{



weight.back[n]-=0.01;



}



});








// 命中奖励


hitFront.forEach(n=>{


weight.front[n]+=0.05;


});






hitBack.forEach(n=>{


weight.back[n]+=0.05;


});







this.saveWeight(weight);







let records=

this.records();







records.push({



time:

new Date()
.toLocaleString(),



prediction:pred,



real,


hit:{



front:

hitFront,


back:

hitBack



}



});







localStorage.setItem(

this.recordKey,

JSON.stringify(records)

);







return {



frontHit:

hitFront.length,



backHit:

hitBack.length



};



},







// 获取成长记录


records(){



return JSON.parse(

localStorage.getItem(
this.recordKey
)

||

"[]"

);



},







// 显示


show(){



let box=

document.getElementById(
"learning"
);






if(!box)

return;







box.innerHTML=

`

累计学习次数：

${this.records().length}

<br><br>

数字权重：

已更新

`;



}





};