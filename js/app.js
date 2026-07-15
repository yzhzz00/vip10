// ================================================
// 大乐透AI V90 CORE FINAL
// 系统启动中心
// ================================================

"use strict";





window.V90Progress=function(p){



let bar=

document.getElementById(
"progressBar"
);





let text=

document.getElementById(
"progressText"
);






if(bar){



bar.style.width=

p+"%";



}






if(text){



text.innerHTML=

"蒙特卡罗模拟："

+

p

+

"%";



}



};









// =================================
// 显示模型状态
// =================================


function showModelStatus(){



let box=

document.getElementById(
"modelStatus"
);






if(box){



box.innerHTML=

`

频率模型 ✓

<br>

冷热分析 ✓

<br>

遗漏周期 ✓

<br>

Bayes评分 ✓

<br>

Markov转移 ✓

<br>

蒙特卡罗 ✓

<br>

AI CORE裁决 ✓

`;



}



}









// =================================
// 显示AI结果
// =================================


function showResult(data){



let final=

data.final;






document.getElementById(
"finalResult"
).innerHTML=

`

前区：

${final.front.join(" ")}

<br><br>

后区：

${final.back.join(" ")}

<br><br>

综合评分：

${final.score}

`;








document.getElementById(
"topList"
).innerHTML=



data.top10

.map(

(x,i)=>



`

第${i+1}组：

${x.front.join("-")}

+

${x.back.join("-")}

<br>

评分：

${x.score}

<br><br>

`


)

.join("");







document.getElementById(
"aiMeeting"
).innerHTML=



final.meeting.join(
"<br>"
)

+

"<br><br>"

+

final.risk;



}









// =================================
// 开始AI分析
// =================================


async function startAI(){





document.getElementById(
"progressText"
).innerHTML=

"读取历史数据...";







let history=

V90Data.get();








if(
history.length===0
){



alert(
"历史数据未加载"
);


return;


}








document.getElementById(
"progressText"
).innerHTML=

"AI模型计算中...";







let result=

await V90Core.run();







showResult(result);








let final=

result.final;








V90Review.savePrediction({



time:

Date.now(),



front:

final.front,



back:

final.back,



score:

final.score



});








document.getElementById(
"progressText"
).innerHTML=

"分析完成";







}









// =================================
// 页面初始化
// =================================


document.addEventListener(

"DOMContentLoaded",

async()=>{







document.getElementById(
"status"
).innerHTML=

"V90 AI CORE启动完成";







let data=

await V90Data.load();







document.getElementById(
"dataStatus"
).innerHTML=

"历史数据：已加载 "

+

data.length

+

"期";








showModelStatus();







let btn=

document.getElementById(
"startBtn"
);







if(btn){



btn.onclick=

startAI;



}








V90Learning.show();






});