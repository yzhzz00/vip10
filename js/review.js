// ================================================
// 大乐透AI V90 FINAL
// 开奖反馈复盘学习模块
// ================================================

"use strict";


window.V90Review={



learningKey:"V90_LEARNING_RECORD",







// ================================================
// 解析开奖
// ================================================


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







// ================================================
// 对比预测
// ================================================


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







// ================================================
// AI复盘
// ================================================


analysis(result){



let text=[];



if(
result.frontHit>=3
){



text.push(
"前区模型表现良好"
);



}else{



text.push(
"前区偏差较大，需要调整权重"
);



}






if(
result.backHit>=1
){



text.push(
"后区判断有效"
);



}else{



text.push(
"后区模型需要优化"
);



}







return text;



},







// ================================================
// 保存学习
// ================================================


save(data){



let list=

JSON.parse(

localStorage.getItem(
this.learningKey
)

||

"[]"

);





list.push(data);






localStorage.setItem(

this.learningKey,

JSON.stringify(list)

);



},







// ================================================
// 学习次数
// ================================================


count(){



return JSON.parse(

localStorage.getItem(
this.learningKey
)

||

"[]"

)

.length;



},







// ================================================
// 初始化按钮
// ================================================


init(){



let btn=

document.getElementById(
"reviewBtn"
);





if(!btn)

return;






btn.onclick=function(){





let value=

document.getElementById(
"openResult"
)

.value;






let real=

V90Review.parse(value);






if(!real){



document.getElementById(
"reviewResult"
)

.innerHTML=

"开奖号码格式错误，请输入7个号码";



return;


}






let pred=

V90Record.last();






if(!pred){



document.getElementById(
"reviewResult"
)

.innerHTML=

"没有找到预测记录";



return;


}






let result=

V90Review.compare(

pred,

real

);






let report=

V90Review.analysis(
result
);







V90Review.save({



time:

Date.now(),



prediction:pred,



real:real,



result:result



});









document.getElementById(
"reviewResult"
)

.innerHTML=



"预测结果：<br>"

+

pred.front.join(" ")

+

" + "

+

pred.back.join(" ")

+

"<br><br>"

+

"实际结果：<br>"

+

real.front.join(" ")

+

" + "

+

real.back.join(" ")

+

"<br><br>"

+

"命中统计：<br>"

+

"前区："

+

result.frontHit

+

"/5<br>"

+

"后区："

+

result.backHit

+

"/2<br>"

+

"总命中："

+

result.total

+

"/7<br><br>"

+

"AI复盘：<br>"

+

report.join("<br>");








let learn=

document.getElementById(
"learningStatus"
);



if(learn){



learn.innerHTML=

"累计学习次数："

+

V90Review.count();



}





};



}





};





document.addEventListener(

"DOMContentLoaded",

()=>{


V90Review.init();



});