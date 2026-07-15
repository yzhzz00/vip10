// ================================================
// V90 AI CORE FINAL R6
// 系统主控制中心
// ================================================

"use strict";




// =================================
// 模型状态显示
// =================================


function showModels(){



let box=

document.getElementById(
"models"
);





if(!box)

return;






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

蒙特卡罗模拟 ✓

<br>

AI CORE裁决 ✓

<br>

自动学习 ✓

<br>

回测中心 ✓

`;



}









// =================================
// 显示预测
// =================================


function showResult(data){



let final=

data.final;







document.getElementById(
"finalResult"
).innerHTML=

`

预测编号：

${data.id}

<br><br>


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

data.top10.map(

(item,index)=>

`

第 ${index+1} 组：

${item.front.join("-")}

+

${item.back.join("-")}


<br>

评分：

${item.score}

<br><br>

`

).join("");








document.getElementById(
"meeting"
).innerHTML=

data.meeting.join(
"<br>"
);



}









// =================================
// AI分析按钮
// =================================


async function startAnalyze(){



let box=

document.getElementById(
"progressText"
);







box.innerHTML=

"正在读取历史数据...";







let history=

V90Database.get();







if(
history.length===0
){



box.innerHTML=

"没有历史数据";



return;



}






box.innerHTML=

"AI模型计算中...";







let result=

await V90Core.analyze();








showResult(result);







box.innerHTML=

"分析完成";





}









// =================================
// 初始化
// =================================


async function initSystem(){





document.getElementById(
"status"
).innerHTML=

"V90 AI CORE R6启动完成";







let data=

await V90Database.init();








document.getElementById(
"dataStatus"
).innerHTML=

`

历史数据：

${data.length}

期

`;








showModels();







let btn=

document.getElementById(
"startBtn"
);








if(btn){



btn.onclick=

startAnalyze;



}







}








document.addEventListener(

"DOMContentLoaded",

()=>{



initSystem();



});