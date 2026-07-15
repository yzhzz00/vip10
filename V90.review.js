// ================================================
// 大乐透AI V90 开奖复盘学习模块
// ================================================


"use strict";



window.V90Review={







// ================================================
// 号码解析
// ================================================


parse(text){



let nums =

text
.trim()
.split(/\s+/)
.map(Number);





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
// 保存学习记录
// ================================================


save(data){



let old=

JSON.parse(

localStorage.getItem(
"V90_LEARNING"
)

||

"[]"

);





old.push(data);





localStorage.setItem(

"V90_LEARNING",

JSON.stringify(old)

);



},







// ================================================
// 学习次数
// ================================================


count(){



return JSON.parse(

localStorage.getItem(
"V90_LEARNING"
)

||

"[]"

)

.length;



},







// ================================================
// AI复盘报告
// ================================================


report(result){



let text="";





if(
result.total===0
){



text+=
"本次未命中，需要重新评估冷热权重。\n";



}



if(
result.frontHit>=3
){



text+=
"前区模型表现较好。\n";


}



if(
result.backHit>=1
){



text+=
"后区模型有效。\n";


}





text+=
"AI已保存本次反馈。";





return text;



}







};









// ================================================
// 页面绑定
// ================================================


document.addEventListener(
"DOMContentLoaded",
()=>{





let btn =
document.getElementById(
"feedbackBtn"
);






if(btn){



btn.onclick=function(){





let input =

document.getElementById(
"realNumber"
)
.value;




let real =

V90Review.parse(
input
);





if(!real){



document.getElementById(
"review"
).innerHTML=

"请输入7个号码";


return;



}






if(
!V90.prediction
){



document.getElementById(
"review"
).innerHTML=

"请先完成预测";


return;



}





let result=

V90Review.compare(

V90.prediction,

real

);






let report=

V90Review.report(
result
);






V90Review.save({



time:
Date.now(),



prediction:
V90.prediction,



real,



result



});






document.getElementById(
"review"
).innerHTML=


"预测:\n"

+

V90.prediction.front.join(" ")

+

" + "

+

V90.prediction.back.join(" ")

+

"\n\n实际:\n"

+

real.front.join(" ")

+

" + "

+

real.back.join(" ")

+

"\n\n命中:\n"

+

"前区 "

+

result.frontHit

+

"/5\n"

+

"后区 "

+

result.backHit

+

"/2\n"

+

"总计 "

+

result.total

+

"/7\n\n"

+

report;







let learn=

document.getElementById(
"learning"
);



if(learn){



learn.innerHTML=

"累计学习："

+

V90Review.count()

+

"次";



}





};





}



});