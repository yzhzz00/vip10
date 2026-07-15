// ================================================
// V90 AI CORE FINAL R3
// 开奖复盘模块
// ================================================

"use strict";


window.V90Review={



recordKey:"V90_PREDICTION_RECORD",







// =================================
// 解析开奖
// =================================


parse(text){



let nums=

text

.replace(/,/g," ")

.split(/\s+/)

.map(Number)

.filter(

n=>!isNaN(n)

);






if(
nums.length!==7
){



return null;



}







return {



front:

nums.slice(0,5),



back:

nums.slice(5,7)



};



},







// =================================
// 保存预测
// =================================


savePrediction(data){



let list=

JSON.parse(

localStorage.getItem(
this.recordKey
)

||

"[]"

);







list.push(data);







localStorage.setItem(

this.recordKey,

JSON.stringify(list)

);



},







// =================================
// 获取最近预测
// =================================


last(){



let list=

JSON.parse(

localStorage.getItem(
this.recordKey
)

||

"[]"

);






if(
list.length===0
)

return null;






return list[
list.length-1
];



},







// =================================
// 对比
// =================================


compare(pred,real){



let frontHit=0;

let backHit=0;







pred.front.forEach(n=>{



if(
real.front.includes(n)
){



frontHit++;



}



});







pred.back.forEach(n=>{



if(
real.back.includes(n)
){



backHit++;



}



});








return {



frontHit,


backHit,


total:

frontHit+backHit



};



},







// =================================
// 初始化按钮
// =================================


init(){



let btn=

document.getElementById(
"reviewBtn"
);







if(!btn)

return;







btn.onclick=()=>{



let input=

document.getElementById(
"openResult"
).value;







let real=

this.parse(input);







if(!real){



document.getElementById(
"review"
).innerHTML=

"请输入7个开奖号码";



return;



}








let pred=

this.last();







if(!pred){



document.getElementById(
"review"
).innerHTML=

"暂无预测记录";



return;



}








let result=

this.compare(

pred,

real

);







// 调用学习


V90Learning.train(
result
);








document.getElementById(
"review"
).innerHTML=

`

预测结果：

<br>

${pred.front.join(" ")}

+

${pred.back.join(" ")}



<br><br>


实际结果：

<br>

${real.front.join(" ")}

+

${real.back.join(" ")}



<br><br>


前区命中：

${result.frontHit}/5


<br>


后区命中：

${result.backHit}/2


<br>


总命中：

${result.total}/7


`;








V90Learning.show();



};



}






};







document.addEventListener(

"DOMContentLoaded",

()=>{


V90Review.init();


});