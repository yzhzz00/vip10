// ================================================
// V90 AI CORE R5
// 开奖反馈复盘中心
// ================================================

"use strict";


window.V90Review={



// =================================
// 获取输入开奖
// =================================


getDraw(){



let period=

document.getElementById(
"period"
).value;





let front=[



Number(
document.getElementById("front1").value
),


Number(
document.getElementById("front2").value
),


Number(
document.getElementById("front3").value
),


Number(
document.getElementById("front4").value
),


Number(
document.getElementById("front5").value
)



];








let back=[



Number(
document.getElementById("back1").value
),


Number(
document.getElementById("back2").value
)



];









if(

front.some(
n=>!n
)

||

back.some(
n=>!n
)

){



return null;



}







return {



period,

front,

back



};



},







// =================================
// 命中计算
// =================================


compare(pred,real){



let frontHit=

pred.front.filter(

n=>

real.front.includes(n)

);







let backHit=

pred.back.filter(

n=>

real.back.includes(n)

);






return {



front:

frontHit,


back:

backHit,


frontCount:

frontHit.length,


backCount:

backHit.length,


total:

frontHit.length

+

backHit.length



};



},







// =================================
// 保存开奖并学习
// =================================


save(){



let real=

this.getDraw();







if(!real){



document.getElementById(
"review"
).innerHTML=

"请输入完整7个号码";



return;



}







let pred=

V90Review.lastPrediction();






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







// 加入历史库


V90Data.addDraw(

real.period,

real.front,

real.back

);








// AI学习


V90Learning.learn(

pred,

real

);








document.getElementById(
"review"
).innerHTML=

`

开奖：

${real.front.join(" ")}

+

${real.back.join(" ")}


<br><br>


预测：

${pred.front.join(" ")}

+

${pred.back.join(" ")}


<br><br>


前区命中：

${result.frontCount}/5


<br>

后区命中：

${result.backCount}/2


<br>

总命中：

${result.total}/7


<br><br>

AI已完成学习

`;






V90Learning.show();



},







// =================================
// 获取最近预测
// =================================


lastPrediction(){



let data=

localStorage.getItem(
"V90_CURRENT_PREDICTION"
);






if(!data)

return null;







let obj=

JSON.parse(data);






return {



front:

obj.final.front,


back:

obj.final.back



};



},







// =================================
// 初始化
// =================================


init(){



let btn=

document.getElementById(
"reviewBtn"
);







if(btn){



btn.onclick=()=>{



this.save();



};



}



}






};






document.addEventListener(

"DOMContentLoaded",

()=>{


V90Review.init();



});