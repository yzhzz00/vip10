// ================================================
// 大乐透AI V90 CORE FINAL
// 开奖复盘系统
// ================================================

"use strict";


window.V90Review={



key:"V90_RECORD",







// =================================
// 解析开奖号码
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





if(nums.length!==7){


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
// 对比预测
// =================================


compare(pred,real){



let frontHit=0;

let backHit=0;







pred.front.forEach(n=>{



if(real.front.includes(n)){



frontHit++;



}



});






pred.back.forEach(n=>{



if(real.back.includes(n)){



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
// 保存预测记录
// =================================


savePrediction(data){



let list=

JSON.parse(

localStorage.getItem(
this.key
)

||

"[]"

);





list.push(data);






localStorage.setItem(

this.key,

JSON.stringify(list)

);



},







// =================================
// 最近预测
// =================================


lastPrediction(){



let list=

JSON.parse(

localStorage.getItem(
this.key
)

||

"[]"

);






if(list.length===0)

return null;





return list[
list.length-1
];



},







// =================================
// 初始化反馈按钮
// =================================


init(){



let btn=

document.getElementById(
"reviewBtn"
);





if(!btn)

return;






btn.onclick=()=>{



let value=

document.getElementById(
"openResult"
).value;






let real=

this.parse(value);






if(!real){



document.getElementById(
"review"
).innerHTML=

"开奖号码格式错误";


return;



}







let pred=

this.lastPrediction();






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


实际开奖：

<br>

${real.front.join(" ")}

+

${real.back.join(" ")}



<br><br>


命中：

<br>

前区：

${result.frontHit}/5


<br>

后区：

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