// ================================================
// 大乐透AI V90 FINAL R2
// 开奖反馈学习模块
// ================================================

"use strict";


window.V90Review={



key:"V90_LEARNING",







// 解析开奖


parse(text){



let nums=

text

.replace(/,/g," ")

.split(/\s+/)

.map(Number)

.filter(
x=>!isNaN(x)
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







// 对比结果


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







// AI复盘


analysis(r){



let arr=[];





if(
r.frontHit>=3
){



arr.push(
"前区模型命中表现较好"
);



}else{



arr.push(
"前区需要调整冷热权重"
);



}






if(
r.backHit>=1
){



arr.push(
"后区预测有效"
);



}else{



arr.push(
"后区需要重新训练"
);



}






return arr;



},







// 保存学习


save(data){



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







// 学习次数


count(){



return JSON.parse(

localStorage.getItem(
this.key
)

||

"[]"

)

.length;



},







// 初始化


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
"reviewResult"
).innerHTML=

"请输入7个开奖号码";



return;



}






let pred=

V90Record.last();






if(!pred){



document.getElementById(
"reviewResult"
).innerHTML=

"暂无预测记录";



return;



}






let result=

this.compare(
pred,
real
);





let report=

this.analysis(
result
);







this.save({



time:

Date.now(),


prediction:pred,


real,


result



});








document.getElementById(
"reviewResult"
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


命中：

<br>

前区 ${result.frontHit}/5

<br>

后区 ${result.backHit}/2

<br>

总命中 ${result.total}/7

<br><br>


AI复盘：

<br>

${report.join("<br>")}

`;







let learn=

document.getElementById(
"learningStatus"
);





if(learn){



learn.innerHTML=

"累计学习次数："

+

this.count();



}





};




}






};






document.addEventListener(

"DOMContentLoaded",

()=>{


V90Review.init();



});