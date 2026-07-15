// ================================================
// V90 AI CORE FINAL R7.0
// 开奖反馈中心
// ================================================

"use strict";


window.V90Review={







// =================================
// 获取输入
// =================================


getInput(){



let period=

document.getElementById(

"period"

).value;






let front=[



Number(document.getElementById("f1").value),


Number(document.getElementById("f2").value),


Number(document.getElementById("f3").value),


Number(document.getElementById("f4").value),


Number(document.getElementById("f5").value)



];







let back=[



Number(document.getElementById("b1").value),


Number(document.getElementById("b2").value)



];







if(

front.some(x=>!x)

||

back.some(x=>!x)

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
// 获取冻结预测
// =================================


getPrediction(){



let data=

localStorage.getItem(

"V90_R7_LAST_PREDICTION"

);






if(!data)

return null;







return JSON.parse(data);



},







// =================================
// 比较
// =================================


compare(pred,real){



let frontHit=

pred.final.front.filter(

x=>

real.front.includes(x)

);







let backHit=

pred.final.back.filter(

x=>

real.back.includes(x)

);







return {



front:

frontHit.length,



back:

backHit.length,



total:

frontHit.length+

backHit.length



};



},







// =================================
// 保存反馈
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

"请输入完整开奖";



return;



}







let prediction=

this.getPrediction();







if(!prediction){



box.innerHTML=

"暂无预测记录";



return;



}








let result=

this.compare(

prediction,

real

);







// 保存开奖


V90Database.add(

real.period,

real.front,

real.back

);







// 保存反馈记录


let records=

JSON.parse(

localStorage.getItem(

"V90_R7_FEEDBACK"

)

||

"[]"

);







records.push({



period:real.period,


prediction,


real,


result,


time:

Date.now()



});







localStorage.setItem(

"V90_R7_FEEDBACK",

JSON.stringify(records)

);







box.innerHTML=

`

开奖：

${real.front.join(" ")}

+

${real.back.join(" ")}


<br><br>


预测：

${prediction.final.front.join(" ")}

+

${prediction.final.back.join(" ")}


<br><br>


前区命中：

${result.front}/5


<br>


后区命中：

${result.back}/2


<br>


总命中：

${result.total}/7


<br><br>


反馈已保存

下一轮训练生效

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