// ================================================
// V90 AI CORE FINAL R6.1
// 开奖反馈学习中心
// ================================================

"use strict";


window.V90Review={







// =================================
// 获取开奖输入
// =================================


getInput(){



let period=

document.getElementById(
"period"
).value;







let front=[


Number(
document.getElementById("f1").value
),


Number(
document.getElementById("f2").value
),


Number(
document.getElementById("f3").value
),


Number(
document.getElementById("f4").value
),


Number(
document.getElementById("f5").value
)


];








let back=[


Number(
document.getElementById("b1").value
),


Number(
document.getElementById("b2").value
)


];








if(

front.some(n=>!n)

||

back.some(n=>!n)

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
// 获取最近预测
// =================================


getPrediction(){



let data=

localStorage.getItem(

"V90_R61_PREDICTION"

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
// 命中计算
// =================================


check(pred,real){



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


front:frontHit,

back:backHit,


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
// 保存开奖学习
// =================================


save(){



let real=

this.getInput();






let box=

document.getElementById(
"review"
);







if(!real){



box.innerHTML=

"请输入完整开奖号码";



return;



}








let pred=

this.getPrediction();







if(!pred){



box.innerHTML=

"暂无预测记录";



return;



}







let result=

this.check(

pred,

real

);







// 保存新开奖


V90Database.add(

real.period,

real.front,

real.back

);








// AI学习


let learn=

V90Learning.learn(

pred,

real

);







let stats=

V90Learning.stats();








box.innerHTML=

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


AI累计学习：

${stats.count}

次


<br>


权重已经更新

`;







}







};









document.addEventListener(

"DOMContentLoaded",

()=>{



let btn=

document.getElementById(
"saveDraw"
);





if(btn){



btn.onclick=

()=>{


V90Review.save();



};



}



});