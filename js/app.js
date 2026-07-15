// ================================================
// V90 AI CORE FINAL R6.1
// 系统主控制中心
// ================================================


"use strict";



let analyzing=false;





// =================================
// 进度显示
// =================================


window.V90Progress=function(
percent,
current,
total
){



let bar=

document.getElementById(
"progressBar"
);



let number=

document.getElementById(
"progressNumber"
);



let text=

document.getElementById(
"progressText"
);






if(bar){


bar.style.width=

percent+"%";


}







if(number){


number.innerHTML=

percent+"%";


}






if(text){



text.innerHTML=

`

蒙特卡罗模拟中...

<br>

已计算：

${current.toLocaleString()}

/

${total.toLocaleString()}

组

`;



}



};









// =================================
// 模型显示
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

滚动回测 ✓

`;



}








// =================================
// 显示结果
// =================================


function showResult(data){



let final=

data.final;





let result=

document.getElementById(
"finalResult"
);






result.innerHTML=

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








let top=

document.getElementById(
"topList"
);






top.innerHTML=

data.top10.map(

(item,index)=>{


return `


第${index+1}组：

${item.front.join("-")}

+

${item.back.join("-")}


<br>

评分：

${item.score}

<br><br>


`;



}

).join("");







document.getElementById(
"meeting"
).innerHTML=

data.meeting.join(
"<br>"
);



}









// =================================
// 开始分析
// =================================


async function startAnalyze(){



if(analyzing)

return;



analyzing=true;






let text=

document.getElementById(
"progressText"
);






text.innerHTML=

"正在读取历史数据...";








let history=

V90Database.get();







if(
history.length===0
){



text.innerHTML=

"历史数据为空";


analyzing=false;


return;



}







text.innerHTML=

"AI模型初始化...";








try{



let result=

await V90Core.analyze(
true
);






showResult(result);







text.innerHTML=

"分析完成";







}
catch(e){



console.log(e);



text.innerHTML=

"分析失败";



}







analyzing=false;



}









// =================================
// 初始化
// =================================


async function initSystem(){



document.getElementById(
"status"
).innerHTML=

"V90 AI CORE R6.1启动完成";








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