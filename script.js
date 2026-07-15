/*
================================

大乐透智能分析系统

V71.2 AI CORE

script.js

页面控制

================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{

    initSystem();

});









// ============================
// 系统初始化
// ============================


async function initSystem(){


    try{


        if(!window.AIEngine){


            throw new Error(
                "AIEngine 未加载"
            );


        }



        await window.AIEngine.init();



        showStatus();



        showAgents();



    }


    catch(e){


        console.error(e);



        let box=

        document.getElementById(
            "status"
        );



        if(box){


            box.innerHTML=

            "加载失败："+e.message;


        }


    }


}









// ============================
// 显示状态
// ============================


function showStatus(){



    let status=

    window.AIEngine.status();



    let box=

    document.getElementById(
        "status"
    );



    if(box){



        box.innerHTML=

`
系统加载成功<br>

版本：
${status.version}

<br>

历史数据：
${status.data}

<br>

AI模型：

${status.agents.join("/")}

<br>

Engine：

${status.engines.join("/")}

`;



    }


}









// ============================
// 显示Agent
// ============================


function showAgents(){



    let box=

    document.getElementById(
        "agents"
    );



    if(!box)return;





    let status=

    window.AIEngine.status();





    box.innerHTML="";





    status.agents.forEach(a=>{



        box.innerHTML+=

`
<div class="agent">

${a}

</div>
`;



    });



}









// ============================
// 开始AI分析
// ============================


async function startAI(){



    let report=

    document.getElementById(
        "report"
    );



    if(report){


        report.innerHTML=

        "AI多模型会议分析中...";


    }






    try{



        let result=

        await window.AIEngine.analyze();





        renderReport(result);



    }



    catch(e){



        report.innerHTML=

        "分析失败："+e.message;



    }



}









// ============================
// 渲染报告
// ============================


function renderReport(result){



    let html="";





    html+=`

<h3>
AI多模型会议报告
</h3>

`;








// Agent结果


if(result.models){



    Object.keys(

        result.models

    )

    .forEach(key=>{



        html+=

`
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



    });



}









// Monte Carlo


if(result.simulation){



html+=

`
<div class="ai-card">

<h3>
Monte Carlo AI
</h3>


<pre>

${JSON.stringify(

result.simulation,

null,

2

)}

</pre>


</div>
`;



}









// Master


if(result.decision){



html+=

`
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



html+=

`
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

).innerHTML=

html;



}









// ============================
// 开奖反馈
// ============================


function saveFeedback(){



let box=

document.getElementById(

"feedback"

);



if(box){



box.innerHTML=

"开奖反馈已保存";



}



}









// 暴露按钮函数


window.startAI=

startAI;


window.saveFeedback=

saveFeedback;