/*
================================

大乐透智能分析系统

V71.1 AI CORE

script.js

页面控制

================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{


initSystem();



});









async function initSystem(){



    try{



        await AIEngine.init();




        showStatus();



    }

    catch(e){



        console.error(e);



        document.getElementById(
            "status"
        ).innerHTML =

        "加载失败："+e.message;



    }



}









function showStatus(){



    let status=

    AIEngine.status();





    let box=

    document.getElementById(
        "status"
    );






    if(box){



        box.innerHTML=

        `

        系统加载成功<br>

        版本：${status.version}<br>

        历史数据：${status.data}<br>

        AI模型：

        ${status.agents.join("/")}

        `;



    }



}









async function startAI(){



    let reportBox=

    document.getElementById(
        "report"
    );



    if(reportBox){



        reportBox.innerHTML=

        "AI多模型会议分析中...";



    }






    try{



        let result=

        await AIEngine.analyze();





        renderReport(result);



    }

    catch(e){



        reportBox.innerHTML=

        "分析失败："+e.message;



    }



}









function renderReport(result){



    let html="";








    html+=`

<h3>AI多模型会议报告</h3>

`;









// Agent报告



for(

let key in result.models

){



    html+=`

<div class="ai-card">


<h4>

${key.toUpperCase()} AI

</h4>


<pre>

${JSON.stringify(

result.models[key],

null,

2

)}

</pre>


</div>


`;



}









// Monte Carlo



if(result.simulation){



html+=`

<div class="ai-card">


<h3>

Monte Carlo AI 蒙特卡罗模拟

</h3>


<p>

模拟次数：

${result.simulation.simulation}

</p>


`;





result.simulation.top

.forEach(

(item,index)=>{


html+=`

<p>


第 ${index+1} 名<br>


前区：

${item.front.join(" ")}

<br>


后区：

${item.back.join(" ")}

<br>


评分：

${item.score}

</p>


`;



}

);





html+=`

</div>

`;



}









// Master



if(result.decision){



html+=`

<div class="ai-card">


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


</div>


`;



}









// Critic



if(result.critic){



html+=`

<div class="ai-card">


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


</div>


`;



}









document.getElementById(

"report"

).innerHTML=html;



}











// 页面按钮调用

window.startAI=startAI;