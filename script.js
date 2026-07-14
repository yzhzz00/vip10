/*
================================

大乐透智能分析系统

V71.1

前端控制脚本

================================
*/


let systemReady=false;









window.onload=async function(){



try{



if(
!window.AIEngine
){



throw new Error(
"AIEngine不存在"
);



}






await AIEngine.init();







systemReady=true;






showStatus();






showAgents();






}

catch(e){



console.error(e);



document.getElementById(

"dataStatus"

).innerHTML=



"加载失败："+e.message;



}



};









function showStatus(){



let status=

AIEngine.status();






document.getElementById(

"dataStatus"

).innerHTML=



`

<p>系统加载成功</p>

<p>版本：${status.version}</p>

<p>历史数据：${status.data}</p>

<p>状态：${status.ready}</p>

`;



}









function showAgents(){



let box=

document.getElementById(

"agentStatus"

);






box.innerHTML=



AIEngine.status()

.agents

.join(

"<br>"

);



}









async function startAI(){



if(!systemReady){



alert(

"系统未准备完成"

);



return;



}







let box=

document.getElementById(

"analysisResult"

);






box.innerHTML=

"AI分析中...";








try{



let result=

await AIEngine.analyze();







renderResult(result);






}

catch(e){



box.innerHTML=

"分析失败："+e.message;



}



}









function renderResult(result){



let html="";






// Agent报告


html+=`

<h3>
AI多模型会议报告
</h3>

`;







for(let key in result.models){



let model=

result.models[key];






html+=`



<div class="ai-box">


<h4>${key.toUpperCase()} AI</h4>


<pre>

${JSON.stringify(

model,

null,

2

)}

</pre>


</div>


`;



}








// Monte Carlo


if(

result.simulation

){



html+=`

<h3>

Monte Carlo AI 蒙特卡罗模拟

</h3>


<p>

模拟次数：

${result.simulation.simulation}

</p>

`;







result.simulation.top

.forEach((item,index)=>{



html+=`


<div class="ticket">


第 ${index+1} 名


<br>


前区：

${item.front.join(" ")}


<br>


后区：

${item.back.join(" ")}


<br>


评分：

${item.score}


</div>


`;



});



}









// Master


if(result.decision){



html+=`


<h3>

Master AI 总控决策

</h3>


<pre>

${JSON.stringify(

result.decision,

null,

2

)}

</pre>


`;



}









// Critic


if(result.critic){



html+=`


<h3>

Critic AI 自我审查

</h3>


<pre>

${JSON.stringify(

result.critic,

null,

2

)}

</pre>


`;



}







document.getElementById(

"analysisResult"

).innerHTML=

html;








document.getElementById(

"aiReport"

).innerHTML=

`

AI会议完成


<br>

版本：

${result.version}


<br>

参与模型：

${result.agents.join(

" / "

)}

`;



}









function saveFeedback(){



document.getElementById(

"learningStatus"

).innerHTML=



"开奖反馈已保存";



}