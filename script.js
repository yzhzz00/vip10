/*
================================

大乐透智能分析系统

V70.2 CORE SCRIPT

启动版

================================
*/


let systemReady=false;




window.onload=async function(){


try{


document.getElementById(
"dataStatus"
).innerHTML=

"AI系统启动中...";




await AIEngine.init();





let status=

AIEngine.status();





systemReady=true;






document.getElementById(
"dataStatus"
).innerHTML=

"大乐透数据加载成功";





document.getElementById(
"systemStatus"
).innerHTML=

`

版本：

${status.version}


<br>


历史数据：

${status.data}期


<br>


模型：

${status.agents.join(" / ")}

`;





}

catch(e){



document.getElementById(
"dataStatus"
).innerHTML=

"加载失败："+e.message;



console.log(e);



}



};







async function startPredict(){



if(!systemReady){


alert(
"系统还未启动完成"
);


return;


}




let result=

await AIEngine.analyze();





document.getElementById(
"predictResult"
).innerHTML=

`

<h3>
AI分析完成
</h3>


版本：

${result.version}


<br>


历史：

${result.history}期


<br>


状态：

${result.message}


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

"反馈保存成功";


}