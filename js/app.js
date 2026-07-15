// ================================================
// V90 AI CORE FINAL R3
// 系统主控制中心
// ================================================

"use strict";






// =================================
// 进度条
// =================================


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
// 显示模型
// =================================


function showModels(){



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
// 显示结果
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

(item,index)=>

`

第${index+1}组：

${item.front.join("-")}

+

${item.back.join("-")}

<br>

评分：

${item.score}

<br><br>

`

)

.join("");









document.getElementById(
"aiMeeting"
).innerHTML=

`

${final.meeting.join("<br>")}

<br><br>

${final.risk}

`;






}









// =================================
// 开始分析
// =================================


async function startAI(){





let text=

document.getElementById(
"progressText"
);






text.innerHTML=

"正在读取历史数据...";








let history=

V90Data.get();






if(
history.length===0
){



text.innerHTML=

"历史数据为空";



return;



}









text.innerHTML=

"AI CORE计算中...";








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
"records"
).innerHTML=

`

最近预测：

<br>

${final.front.join(" ")}

+

${final.back.join(" ")}

<br>

评分：

${final.score}

`;







text.innerHTML=

"分析完成";





}









// =================================
// 页面启动
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









showModels();








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