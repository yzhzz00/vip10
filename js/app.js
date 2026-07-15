// ================================================
// V90 AI CORE R5
// 系统主控制中心
// ================================================

"use strict";






// =================================
// 模拟进度显示
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

"蒙特卡罗优化："

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

加权蒙特卡罗 ✓

<br>

AI CORE R5裁决 ✓

`;



}



}









// =================================
// 显示最终结果
// =================================


function showAIResult(data){



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

final.meeting.join(
"<br>"
);







}









// =================================
// 开始AI分析
// =================================


async function startAI(){



let text=

document.getElementById(
"progressText"
);






text.innerHTML=

"正在读取历史数据...";







let data=

V90Data.get();







if(
data.length===0
){



text.innerHTML=

"历史数据为空";



return;



}









text.innerHTML=

"AI训练中...";








let result=

await V90Core.run();









showAIResult(result);








// 保存预测记录


localStorage.setItem(

"V90_LAST_PREDICTION",

JSON.stringify(result)

);









document.getElementById(
"records"
).innerHTML=

`

预测编号：

${result.id}

<br><br>

最近预测：

${result.final.front.join(" ")}

+

${result.final.back.join(" ")}

<br><br>

评分：

${result.final.score}

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

"V90 AI CORE R5启动完成";








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