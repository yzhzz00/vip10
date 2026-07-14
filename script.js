/*
================================

大乐透智能分析系统

V70.5 CORE SCRIPT

Critic AI显示版

================================
*/


let systemReady=false;




window.onload=async function(){


try{


document.getElementById(
"dataStatus"
).innerHTML=

"AI系统启动中...";





await window.AIEngine.init();






let status=

window.AIEngine.status();






systemReady=true;






document.getElementById(
"dataStatus"
).innerHTML=

"系统加载成功";






document.getElementById(
"systemStatus"
).innerHTML=

`

版本：

${status.version}

<br>

历史数据：

${status.data}

<br>

AI模型：

${status.agents.join(" / ")}

`;






document.getElementById(
"agentList"
).innerHTML=

status.agents.join(
"<br>"
);




}



catch(e){



console.error(e);



document.getElementById(
"dataStatus"
).innerHTML=

"加载失败："+e.message;



}



};









async function startPredict(){



if(!systemReady){



alert(
"系统未启动"
);



return;


}






let result=

await window.AIEngine.analyze();






let html=

`

<h3>
AI多模型会议报告
</h3>

`;







if(result.meeting.trend){



html+=`

<b>Trend AI 趋势分析</b>

<br>

${result.meeting.trend.reason.join("<br>")}

<br><br>

`;

}





if(result.meeting.structure){



html+=`

<b>Structure AI 结构分析</b>

<br>

${result.meeting.structure.reason.join("<br>")}

<br><br>

`;

}





if(result.meeting.markov){



html+=`

<b>Markov AI 转移分析</b>

<br>

${result.meeting.markov.reason.join("<br>")}

<br><br>

`;

}





if(result.meeting.risk){



html+=`

<b>Risk AI 风险分析</b>

<br>

${result.meeting.risk.reason.join("<br>")}

<br><br>

`;

}





if(result.meeting.review){



html+=`

<b>Review AI 复盘分析</b>

<br>

${result.meeting.review.reason.join("<br>")}

<br><br>

`;

}








if(result.meeting.confidence){



html+=`

<h3>
Confidence AI 信心指数
</h3>


综合信心：

${result.meeting.confidence.confidence}%


<br>


等级：

${result.meeting.confidence.level}


<br><br>

`;



}









// Master AI


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








// Critic AI


if(result.critic){



html+=`

<h3>
Critic AI 自我审查
</h3>


信心：

${result.critic.confidence}%


<br>


等级：

${result.critic.level}


<br><br>


<b>挑战意见：</b>

<br>


${result.critic.challenge.join("<br>")}


<br><br>


<b>风险提醒：</b>

<br>


${result.critic.reason.join("<br>")}



`;



}









document.getElementById(
"predictResult"
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

${result.agents.join(" / ")}

`;






}









function saveFeedback(){



let value=

document.getElementById(
"realResult"
).value;






localStorage.setItem(

"dlt_feedback",

value

);






document.getElementById(
"learningStatus"
).innerHTML=

"开奖反馈已保存";



}